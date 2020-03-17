import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
import { delayLoop, urlDirFn } from "../utils/index.mjs";

dotenv.config();

let server =
    'http://localhost:8080/{"$or":[  {"contractAddress":"0x9e1ae1cae3e9609626753086d4859cddc33f1cc8"}, {"contractAddress":"0x6fa85aa3f44f296de1294e3c097872235215b822"}]}';

server = "http://localhost:8080/";

export default function downloadContracts() {
    axios.get(server).then(function(response) {
        response.data.forEach(
            delayLoop(
                e => download(urlDirFn(e.contractAddress.toLowerCase())),
                200
            )
        );
    });
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
