import paso from "./paso.js";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";
import * as c from "../contract/contract.js";

import csv from "csvtojson";

// TODO import from a conf file
const fn_metric = "./data/metrics.csv";
const fn_metric_json = "./data/metrics.json";

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
    const dest = c.getDestFromAddr(contractAddress);
    fs.existsSync(dest) &&
        getJsonMetricsFromSol(dest).then((data) => {
            data.contractAddress = contractAddress;
            const csv = new ObjectsToCsv([data]);
            csv.toDisk(fn_metric, { append: true, header: false });
        });
};

export function writeMetrics2CSV() {
    c.getContracts()
        .then(function (response) {
            response.forEach((json) => {
                writeMetricsSingleContract(c.getAddress(json));
            });
        })
        .catch((e) => console.log(e))
        .finally(() => console.log(`JSON data is saved into ${fn_metric}`));
}

export function writeMetrics2JSON() {
    csv({ checkType: true })
        .fromFile(fn_metric)
        .then((r) => {
            fs.writeFile(fn_metric_json, JSON.stringify(r), (err) => {
                if (err) {
                    throw err;
                }
                console.log(`JSON data is saved into ${fn_metric}`);
            });
        });
}
