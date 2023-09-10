import formidable, { File } from 'formidable';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "5mb"
        }
    }
}

export default function handler(req, res) {
    if (req.method == "POST") {
        res.status(200).json({
            result: "TODO"
        });
    } else {
        res
            .status(405)
            .json({ 
                error: `Method '${req.method}' Not Allowed` 
            });
    }
}