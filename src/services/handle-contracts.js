import https from "https";
import fs from "fs";
import * as c from "../contract/contract.js";

const downloadContracts = () => {
    try {
        const addresses = c.getContracts();
        addresses.forEach(downloadSmartContract);
    } catch (e) {
        console.error("--- Error in downloading the contract ---", e);
    }
};

const downloadSmartContract = (address, i) => {
    const doesExist = doesFileExist(address);
    console.log({ address, i, doesExist });
    doesExist || setTimeout(() => download(address), i * 500);
};

const doesFileExist = (address) => {
    const dest = c.getDestFromAddr(address);
    return fs.existsSync(dest);
};

const download = (address) => {
    const url = c.getUrlFromAddr(address);
    const dir = c.getDirFromAddr(address);
    const dest = c.getDestFromAddr(address);

    !fs.existsSync(dir) && fs.mkdirSync(dir);

    https.get(url, function(response) {
        const isGoodResponse = response.headers["content-length"] > 150;
        if (!isGoodResponse) return null;
        let file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on("finish", () => console.log(url));
    });
};

downloadContracts();
