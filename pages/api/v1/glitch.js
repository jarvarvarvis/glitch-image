import { formidable } from "formidable";
import { promises as fs } from "fs";

import { Image } from "image-js";

import { MAX_UPLOAD_FILE_SIZE_BYTES } from "@/constants";

import { LuminanceFilter } from "@/glitching/filters/luminance";
import { CompositeFilter } from "@/glitching/filters/composite";
import { ThresholdFilter } from "@/glitching/filters/threshold";
import { Glitcher } from "@/glitching/glitcher";
import { RandomOffsetMaskedSpanGatherer } from "@/glitching/gatherers/random_offset_masked";

export const config = {
    api: {
        bodyParser: false
    }
}

async function sendFileDataToClient(res, file) {
    console.log("Temporarily saved " + file.filepath + " to disk");

    // Read the data of the file
    var imageBytes = await fs.readFile(file.filepath);
    console.log("Received data:");
    console.log(imageBytes);

    // Delete the file
    await fs.rm(file.filepath);
    console.log("Deleted " + file.filepath);

    // Send data
    res.status(200).json({
        status: "OK",
        data: imageBytes,
    });
}

export default async function handler(req, res) {
    if (req.method != "POST") {
        res.status(405).json({ 
            error: `Method '${req.method}' Not Allowed` 
        });
    }

    try {
        // Form parsing
        const data = await new Promise((resolve, reject) => {
            const form = formidable({
                keepExtensions: true,
                maxFileSize: MAX_UPLOAD_FILE_SIZE_BYTES
            });
    
            console.log("Parsing request...");
            form.parse(req, (err, fields, files) => {
                if (err) 
                    reject({ err });
                resolve({ err, fields, files });
                console.log("Done parsing request.");
            });
        });

        // Load image and perform operations
        var file = data.files.file[0];
        var cfg = JSON.parse(data.fields.cfg);
        let image = await Image.load(file.filepath);
        
        // Create mask image
        var maskFilter = new CompositeFilter(
            new LuminanceFilter(),
            new ThresholdFilter(cfg.minThreshold, cfg.maxThreshold)
        );
        var maskImage = maskFilter.applyToImage(image);

        if (cfg.getFilterMask) {
            await maskImage.save(file.filepath);
            await sendFileDataToClient(res, file);
            return;
        }

        // Glitch the image
        var spanGatherer = new RandomOffsetMaskedSpanGatherer(maskImage, 100, 0.75);
        var glitcher = new Glitcher();

        console.log("Starting glitching");
        var resultImage = glitcher.glitchImage(image, spanGatherer, (x1, x2) => {
            var a = x1[0] * 256 * 256 + x1[1] * 256 + x1[2];
            var b = x2[0] * 256 * 256 + x2[1] * 256 + x2[2];
            return a - b;
        });
        console.log("Finished glitching");
        
        // Send data back to client
        await resultImage.save(file.filepath);
        await sendFileDataToClient(res, file);
    } catch (err) {
        var error = err.err;
        var message = error ? error.message : err.message;
        var httpCode = error ? error.httpCode : err.httpCode;
        
        console.log(message);

        res.status(httpCode || 400).json({
            error: error,
            errorMessage: message
        });
        return;
    }
}