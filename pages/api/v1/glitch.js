import { formidable } from "formidable";
import { promises as fs } from "fs";

import { Image } from "image-js";

import { MAX_UPLOAD_FILE_SIZE_BYTES } from "@/constants";

import { Glitcher } from "@/glitching/glitcher";

import { LuminanceFilter } from "@/glitching/filters/luminance";
import { CompositeFilter } from "@/glitching/filters/composite";
import { ThresholdFilter } from "@/glitching/filters/threshold";
import { ChannelValueFilter } from "@/glitching/filters/channel_value";

import { RandomOffsetMaskedSpanGatherer } from "@/glitching/gatherers/random_offset_masked";

import { WeightedChannelEvaluator } from "@/glitching/evaluator/weighted_channel";
import { LuminanceEvaluator } from "@/glitching/evaluator/luminance";

import { AscendingComparison } from "@/glitching/comparisons/ascending";
import { DescendingComparison } from "@/glitching/comparisons/descending";

export const config = {
    api: {
        bodyParser: false
    }
}

async function sendFileDataToClient(res, file) {
    console.log("Temporarily saved " + file.filepath + " to disk");

    // Read the data of the file
    var imageBytes = await fs.readFile(file.filepath);
    console.log("Image data:");
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
            error: {
                message: `Method '${req.method}' Not Allowed` 
            }
        });
    }

    try {
        // Form parsing
        const data = await new Promise((resolve, reject) => {
            const form = formidable({
                keepExtensions: true,
                maxFileSize: MAX_UPLOAD_FILE_SIZE_BYTES
            });
    
            console.log("Request:");
            console.log(req.rawHeaders);
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
        console.log(cfg);
        let image = await Image.load(file.filepath);
        
        // Create mask image
        var filterMap = new Map();
        filterMap.set("luminance", () => new LuminanceFilter());
        filterMap.set("red", () => new ChannelValueFilter(0));
        filterMap.set("green", () => new ChannelValueFilter(1));
        filterMap.set("blue", () => new ChannelValueFilter(2));

        var getFilter = filterMap.get(cfg.filterFunction);
        if (!getFilter) {
            res.status(400).json({
                error: {
                    message: `Filter function '${cfg.filterFunction}' was not found` 
                },
            });
            return;
        }

        var maskFilter = new CompositeFilter(
            getFilter(),
            new ThresholdFilter(cfg.minThreshold, cfg.maxThreshold)
        );
        console.log("Filter:");
        console.log(maskFilter);
        var maskImage = maskFilter.applyToImage(image);

        if (cfg.getFilterMask) {
            await maskImage.save(file.filepath);
            await sendFileDataToClient(res, file);
            return;
        }

        // Glitch the image
        var spanGatherer = new RandomOffsetMaskedSpanGatherer(maskImage, 100, 0.5);
        var glitcher = new Glitcher();

        var evaluatorMap = new Map();
        evaluatorMap.set("rgb", new WeightedChannelEvaluator([0, 1, 2]));
        evaluatorMap.set("bgr", new WeightedChannelEvaluator([2, 1, 0]));
        evaluatorMap.set("luminance", new LuminanceEvaluator());

        console.log("Starting glitching");
        var evaluator = evaluatorMap.get(cfg.sortEvaluatorFunction);
        if (!evaluator) {
            res.status(400).json({
                error: {
                    message: `Evaluator function '${cfg.sortEvaluatorFunction}' was not found` 
                },
            });
            return;
        }
    
        var comparisonMap = new Map();
        comparisonMap.set("ascending", new AscendingComparison());
        comparisonMap.set("descending", new DescendingComparison());

        var comparison = comparisonMap.get(cfg.sortComparisonFunction);
        if (!comparison) {
            res.status(400).json({
                error: {
                    message: `Comparison function '${cfg.sortComparisonFunction}' was not found` 
                },
            });
            return;
        }

        console.log("Evaluator:");
        console.log(evaluator);
        
        console.log("Comparison:");
        console.log(comparison);

        var resultImage = glitcher.glitchImage(image, spanGatherer, (x1, x2) => {
            return comparison.comparePixels(
                evaluator.getPixelValue(x1),
                evaluator.getPixelValue(x2)
            );
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
            error: {
                message: message
            },
        });
        return;
    }
}