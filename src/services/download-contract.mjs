import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import { delayLoop, urlDirFn } from "../utils/index.mjs";
import { getAddresses } from "./index.mjs";

dotenv.config();

export default function downloadContracts() {
    getAddresses().then(addresses =>
        addresses.data.forEach(
            delayLoop(
                e => download(urlDirFn(e.contractAddress.toLowerCase())),
                200
            )
        )
    );
}

const download = url_dir_fn => {
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
};
