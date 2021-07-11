import yaml from "js-yaml";
import fs from "fs";
import dotenv from "dotenv";
import globby from "globby";

dotenv.config();

const config = yaml.load(fs.readFileSync("./src/config.yml", "utf8"));
const { contracts_address } = config;

const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";
const contractDir = "./data/contracts/";

export function getContracts() {
    if (!fs.existsSync(contracts_address))
        throw `The file ${contracts_address} does not exist.`;
    const data = fs.readFileSync(contracts_address);
    const lines = data.toString().split("\n");
    const addresses = lines.map((e) => e.split(",")[1]?.slice(1, -1));
    return addresses.filter((e) => /^0x\w{40}$/.test(e));
}

export const getUrlFromAddr = (contractAddress) =>
    `${source}${contractAddress}&apikey=${process.env.API_KEY}`;

export const getFnFromAddr = (contractAddress) => `${contractAddress}.json`;

export const getDirFromAddr = (address) =>
    `${contractDir}/${address.substring(0, 4)}/`;

export const getDestFromAddr = (contractAddress) =>
    getDirFromAddr(contractAddress) + getFnFromAddr(contractAddress);

export async function getSolFromLocalStorage() {
    const files = await globby(contractDir);
    return files.filter((e) => /.sol$/.test(e));
}
