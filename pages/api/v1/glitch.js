import { formidable } from "formidable";
import { promises as fs } from "fs";

import { Image } from "image-js";

import { MAX_UPLOAD_FILE_SIZE_BYTES } from "@/constants";

import { LuminanceFilter } from "@/glitching/filters/luminance";
import { CompositeFilter } from "@/glitching/filters/composite";
import { ThresholdFilter } from "@/glitching/filters/threshold";
import { MaskedSpanGatherer } from "@/glitching/gatherers/masked";

export const config = {
    api: {
        bodyParser: false
    }
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
        let image = await Image.load(file.filepath);
        var filter = new CompositeFilter(
            new LuminanceFilter(),
            new ThresholdFilter(0, 60)
        );
        var maskImage = filter.applyToImage(image);

        var spanGatherer = new MaskedSpanGatherer(maskImage);
        var spans = spanGatherer.gatherSpansAt(image, 0);
        
        for (var span of spans) {
            console.log(span);
        }
        
        await maskImage.save(file.filepath);
        console.log("Temporarily saved " + file.filepath + " to disk");

        // Read the data of the updated file
        var imageBytes = await fs.readFile(file.filepath);
        console.log("Received data:");
        console.log(imageBytes);

        // Delete the file
        await fs.rm(file.filepath);
        console.log("Deleted " + file.filepath);

        res.status(200).json({
            status: "OK",
            data: imageBytes,
        });
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