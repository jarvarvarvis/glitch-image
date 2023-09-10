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

        console.log("Started parsing");
        form.parse(req, (err, fields, files) => {
            if (err) reject({ err });
            resolve({ err, fields, files })
        });
    });

    var file = data.files.file[0];
    var fileSrc = await fs.readFile(file.filepath);
    console.log(fileSrc);

    res.status(200).json({
        status: "OK",
        data,
    });
}