import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import {
    delayLoop,
    getUrlFromAddr,
    getDirFromAddr,
    getDestFromAddr
} from "../utils/index.js";
import { getAddresses } from "./index.js";
import axios from "axios";

dotenv.config();

export function downloadContracts() {
    getAddresses().then(addresses =>
        addresses.data.forEach(
            delayLoop(e => download(e.contractAddress.toLowerCase()), 200)
        )
    );
}

export function getContractData(contractAddress) {
    const dest = getDestFromAddr(contractAddress);
    console.log(dest);
    if (fs.existsSync(dest)) {
        return fs.promises.readFile(dest, "utf8");
    }
    console.log(getUrlFromAddr(contractAddress));
    return axios.get(getUrlFromAddr(contractAddress));
}

const download = contractAddress => {
    const url = getUrlFromAddr(contractAddress);
    const dir = getDirFromAddr(contractAddress);
    const dest = getDestFromAddr(contractAddress);

    if (fs.existsSync(dest)) return 0;
    !fs.existsSync(dir) && fs.mkdirSync(dir);
    let file = fs.createWriteStream(dest);

    https.get(url, function(response) {
        response.pipe(file);
        file.on("finish", () => console.log(url));
    });
};
