import { formidable } from "formidable";
import { promises as fs } from "fs";

import { MAX_UPLOAD_FILE_SIZE_MB } from "@/constants";

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
                maxFileSize: MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024
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
        var imageBytes = await fs.readFile(file.filepath);
        console.log("Received data:");
        console.log(imageBytes);
        fs.rm(file.filepath); // Remove file

        res.status(200).json({
            status: "OK",
            imageBytes,
        });
    } catch (err) {
        var error = err.err;
        console.log(error.message);

        res.status(error.httpCode).json({
            error: error,
            errorMessage: error.message
        });
        return;
    }
}