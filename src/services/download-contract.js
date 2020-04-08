import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import {
    getUrlFromAddr,
    getDirFromAddr,
    getDestFromAddr,
    getContracts,
} from "../utils/index.js";

dotenv.config();

// TODO put this in a class
// rename setTimeout with throttle and fix it because now the index is incremented even if the contract exists

export function downloadContracts() {
    getContracts().then((json, i) => json.forEach(downloadSingleContract));
}

const getAddress = (obj) => obj.contractAddress.toLowerCase();

const downloadSingleContract = (obj, i) => {
    const address = getAddress(obj);
    doesFileExist(address) || setTimeout(() => download(address), i * 200);
};

const doesFileExist = (contractAddress) => {
    const dest = getDestFromAddr(contractAddress);
    return fs.existsSync(dest);
};

const download = (contractAddress) => {
    const url = getUrlFromAddr(contractAddress);
    const dir = getDirFromAddr(contractAddress);
    const dest = getDestFromAddr(contractAddress);

    !fs.existsSync(dir) && fs.mkdirSync(dir);
    let file = fs.createWriteStream(dest);

    https.get(url, function (response) {
        response.pipe(file);
        file.on("finish", () => console.log(url));
    });
};
