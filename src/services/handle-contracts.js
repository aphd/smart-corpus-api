import https from "https";
import fs from "fs";
import * as c from "../contract/contract.js";

const downloadContracts = () => {
    try {
        const addresses = c.getContracts();
        const addressesNonExisting = addresses.filter((e) => !doesFileExist(e));
        addressesNonExisting.forEach(downloadSmartContract);
    } catch (e) {
        console.error("--- Error in downloading the contract ---", e);
    }
};

const downloadSmartContract = (address, i) =>
    setTimeout(() => download(address), i * 500);

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
        file.on("finish", () => {
            const res = JSON.parse(fs.readFileSync(dest, "utf8")).result[0];
            const abiDest = dest.replace(/.json$/, ".abi");
            const solDest = dest.replace(/.json$/, ".sol");

            fs.writeFileSync(abiDest, res.ABI);
            fs.writeFileSync(solDest, res.SourceCode);
            console.log(url);
        });
    });
};

downloadContracts();
