import https from "https";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export default function download(url_dir_fn) {
    let { url, dir, fn } = url_dir_fn;
    const dest = dir + fn;

    !fs.existsSync(dir) && fs.mkdirSync(dir);
    if (fs.existsSync(dest)) return 0;
    let file = fs.createWriteStream(dest);
    url = `${url}&apikey=${process.env.API_KEY}`;
    https.get(url, function(response) {
        response.pipe(file);
        file.on("finish", () => console.log(url));
    });
}
