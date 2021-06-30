import https from "https";
import fs from "fs";
import * as c from "../contract/contract.js";

const downloadContracts = () => {
    const addresses = c.getContracts();
    addresses.forEach(downloadSmartContract);
};

const downloadSmartContract = (address, i) => {
    console.log({ address, i });
    doesFileExist(address) || setTimeout(() => download(address), i * 200);
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
    let file = fs.createWriteStream(dest);

    https.get(url, function(response) {
        response.pipe(file);
        file.on("finish", () => console.log(url));
    });
};

downloadContracts();
