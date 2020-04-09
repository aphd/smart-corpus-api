import paso from "./paso.js";
import fs from "fs";
import csv from "csvtojson";
import ObjectsToCsv from "objects-to-csv";
import * as c from "../contract/contract.js";

// TODO import from a conf file
const fn_metric = "./data/metrics.csv";
const fn_metric_json = "./data/metrics.json";

const getJsonMetricsFromSol = (dest) =>
    new Promise((resolve) =>
        fs.readFile(dest, "utf8", (err, data) => {
            try {
                resolve(paso(c.getSourceCode(JSON.parse(data))));
            } catch (e) {
                console.log("Paso error in: ", dest);
            }
        })
    );

const writeMetricsSingleContract = (contractAddress) => {
    const dest = c.getDestFromAddr(contractAddress);
    fs.existsSync(dest) &&
        getJsonMetricsFromSol(dest).then(async (data) => {
            data.contractAddress = contractAddress;
            const csv = new ObjectsToCsv([data]);
            await csv.toDisk(fn_metric, { append: true, header: false });
        });
};

const writeMetricsForAllContracts = (contracts) => {
    contracts.forEach((contract) => {
        writeMetricsSingleContract(c.getAddress(contract));
    });
    console.log(`writeMetricsAllContracts ${fn_metric}`);
};

export function writeMetrics2CSV() {
    return new Promise((resolve, reject) => {
        c.getContracts()
            .then(writeMetricsForAllContracts)
            .then(writeMetrics2JSON)
            .then(() => resolve("writeMetrics2CSV ended"))
            .catch((e) => reject(new Error(e)));
    });
}

export function writeMetrics2JSON() {
    csv({ checkType: true })
        .fromFile(fn_metric)
        .then((r) => fs.writeFileSync(fn_metric_json, JSON.stringify(r)))
        .then(() => console.log(`writeMetrics2JSON ${fn_metric_json}`));
}
