import { formidable } from "formidable";
import { promises as fs } from "fs";

import { Image } from "image-js";

import { MAX_UPLOAD_FILE_SIZE_BYTES } from "@/constants";

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

        var file = data.files.file[0];

        // Load image and perform operations
        let image = await Image.load(file.filepath);
        await image.save(file.filepath);
        
        // Read the data of the updated file
        var imageBytes = await fs.readFile(file.filepath);
        console.log("Received data:");
        console.log(imageBytes);

        // Delete the file
        await fs.rm(file.filepath); // Remove file

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