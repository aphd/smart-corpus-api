import https from "https";
import fs from "fs";
import {
    getUrlFromAddr,
    getDirFromAddr,
    getDestFromAddr,
    getContracts,
} from "../utils/index.js";

export const downloadContracts = () =>
    getContracts().then((json, i) => json.forEach(downloadSingleContract));

const getAddress = (obj) => obj.contractAddress.toLowerCase();

const downloadSingleContract = (obj, i) => {
    const address = getAddress(obj);
    console.log(i, address);
    doesFileExist(address) ||
        setTimeout(() => {
            console.log(i * 1000);
            // download(address), i * 1000;
        });
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
