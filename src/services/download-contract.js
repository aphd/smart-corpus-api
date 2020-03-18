import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import { delayLoop } from "../utils/index.js";
import { getAddresses } from "./index.js";

dotenv.config();

const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";

const getUrlFromAddress = contractAddress =>
    `${source}${contractAddress}&apikey=${process.env.API_KEY}`;

const dirFn = contractAddress => ({
    dir: `./src/json/${contractAddress.substring(0, 4)}/`,
    fn: `${contractAddress}.json`
});

export function downloadContracts() {
    getAddresses().then(addresses =>
        addresses.data.forEach(
            delayLoop(e => download(e.contractAddress.toLowerCase()), 200)
        )
    );
}

export function getSourceCode(address) {
    let url = dirFn(address);
    console.log(url);
    return address;
}

const download = contractAddress => {
    let { dir, fn } = dirFn(contractAddress);
    const dest = dir + fn;
    const url = getUrlFromAddress(contractAddress);

    !fs.existsSync(dir) && fs.mkdirSync(dir);
    if (fs.existsSync(dest)) return 0;
    let file = fs.createWriteStream(dest);

    https.get(url, function(response) {
        response.pipe(file);
        file.on("finish", () => console.log(url));
    });
};
