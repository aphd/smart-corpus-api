import https from "https";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export default function download(url, dir, fn, cb) {
    !fs.existsSync(dir) && fs.mkdirSync(dir);
    const dest = dir + fn;
    if (fs.existsSync(dest)) return 0;
    let file = fs.createWriteStream(dest);
    url = `${url}&apikey=${process.env.API_KEY}`;
    https.get(url, function(response) {
        response.pipe(file);
        file.on("finish", function() {
            file.close(cb); // close() is async, call cb after close completes.
        });
    });
}
