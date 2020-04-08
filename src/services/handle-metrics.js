import paso from "./paso.js";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";
import {
    getDestFromAddr,
    getSourceCode,
    getContracts,
} from "../utils/index.js";
import csv from "csvtojson";

// TODO import from a conf file
const fn_metric = "./data/metrics.csv";
const server = "http://localhost:8080/";

const getJsonMetricsFromSol = (dest) =>
    new Promise((resolve) =>
        fs.readFile(dest, "utf8", (err, data) => {
            try {
                resolve(paso(getSourceCode(JSON.parse(data))));
            } catch (e) {
                console.log("Paso error in: ", dest);
            }
        })
    );

const writeMetricsSingleContract = (contractAddress) => {
    const dest = getDestFromAddr(contractAddress);
    fs.existsSync(dest) &&
        getJsonMetricsFromSol(dest).then((data) => {
            data.contractAddress = contractAddress;
            const csv = new ObjectsToCsv([data]);
            csv.toDisk(fn_metric, { append: true, header: false });
        });
};

const readMetricsFromFn = () => {
    return csv({ checkType: true }).fromFile(fn_metric);
};

const getAddress = (obj) => obj.contractAddress.toLowerCase();

export function writeMetrics() {
    getContracts()
        .then(function (response) {
            response.forEach((json) => {
                writeMetricsSingleContract(getAddress(json));
            });
        })
        .catch((e) => console.log(e))
        .finally(() => console.log(`metrics written in ${fn_metric}`));
}
