import { formidable } from "formidable";
import { promises as fs } from "fs";

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

    const data = await new Promise((resolve, reject) => {
        const form = formidable({});

        console.log("Parsing request");
        form.parse(req, (err, fields, files) => {
            if (err) reject({ err });
            resolve({ err, fields, files })
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
}