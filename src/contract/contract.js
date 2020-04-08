import csv from "csv-parser";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";
const verified_address_fn = "/tmp/contracts.csv";
const contractDir = "./data/contracts/";

export function getContracts(columns_to_skip) {
    const results = [];
    return new Promise((resolve) =>
        fs
            .createReadStream(verified_address_fn)
            .pipe(
                csv({
                    mapHeaders: ({ header, index }) => {
                        if (
                            columns_to_skip &&
                            columns_to_skip.includes(header)
                        ) {
                            return null;
                        }
                        return header.charAt(0).toLowerCase() + header.slice(1);
                    },
                    separator: ",",
                })
            )
            .on("data", (data) => {
                results.push(data);
            })
            .on("end", () => {
                resolve(results);
            })
    );
}

export function getAddress(obj) {
    obj.contractAddress.toLowerCase();
}

export function getUrlFromAddr(contractAddress) {
    return `${source}${contractAddress}&apikey=${process.env.API_KEY}`;
}

export function getFnFromAddr(contractAddress) {
    return `${contractAddress}.json`;
}

export function getDirFromAddr(contractAddress) {
    return `${contractDir}/${contractAddress.substring(0, 4)}/`;
}

export function getDestFromAddr(contractAddress) {
    return getDirFromAddr(contractAddress) + getFnFromAddr(contractAddress);
}

export function getSourceCode(data) {
    const sourceCode = data.result[0].SourceCode;
    try {
        const nestedSourceCode = JSON.parse(sourceCode);
        return nestedSourceCode[
            Object.keys(nestedSourceCode)[
                Object.keys(nestedSourceCode).length - 1
            ]
        ].content;
    } catch (e) {
        return sourceCode;
    }
}
