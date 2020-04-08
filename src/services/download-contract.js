import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import {
    getUrlFromAddr,
    getDirFromAddr,
    getDestFromAddr,
    getContracts,
} from "../utils/index.js";
import axios from "axios";

dotenv.config();

// TODO put this in a class
// rename setTimeout with throttle and fix it because now the index is incremented even if the contract exists

const getAddress = (obj) => obj.contractAddress.toLowerCase();

const downloadSingleContract = (obj, i) => {
    const address = getAddress(obj);
    doesFileExist(address) || setTimeout(() => download(address), i * 200);
};

export function downloadContracts() {
    getContracts().then((json, i) => json.forEach(downloadSingleContract));
}

export function getContractData(contractAddress) {
    const dest = getDestFromAddr(contractAddress);
    if (fs.existsSync(dest)) {
        return fs.promises.readFile(dest, "utf8");
    }
    console.log(getUrlFromAddr(contractAddress));
    return axios.get(getUrlFromAddr(contractAddress));
}

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
