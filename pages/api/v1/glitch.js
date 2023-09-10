import { formidable } from "formidable";

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

    const file = data.files.file[0];
    console.log("Got file: " + String(file));

    res.status(200).json({
        status: "OK",
        data,
    });
}