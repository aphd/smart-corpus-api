import paso from "./paso.js";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";
import { getAddresses } from "./index.js";
import { getDestFromAddr } from "../utils/index.js";
import { getSourceCode } from "../utils/index.js";
import csv from "csvtojson";
import axios from "axios";

// TODO import from a conf file
const fn_metric = "./src/csv/contracts-metrics.csv";
const server = "http://localhost:8080/";

const getJsonMetricsFromSol = dest =>
    new Promise(resolve =>
        fs.readFile(dest, "utf8", (err, data) => {
            try {
                resolve(paso(getSourceCode(JSON.parse(data))));
            } catch (e) {
                console.log("Paso error in: ", dest);
            }
        })
    );

const writeMetricsOfOneContract = contractAddress => {
    const dest = getDestFromAddr(contractAddress);
    fs.existsSync(dest) &&
        getJsonMetricsFromSol(dest).then(data => {
            data.contractAddress = contractAddress;
            const csv = new ObjectsToCsv([data]);
            csv.toDisk(fn_metric, { append: true, header: false });
        });
};

const readMetricsFromFn = () => {
    return csv({ checkType: true }).fromFile(fn_metric);
};

export function writeMetrics() {
    getAddresses()
        .then(function(response) {
            response.data.forEach(e => {
                writeMetricsOfOneContract(e.contractAddress.toLowerCase());
            });
        })
        .catch(e => console.log(e));
}

export function postMetrics() {
    readMetricsFromFn()
        .then(result => {
            axios.post(server, result).catch(e => console.log(e));
        })
        .catch(e => console.log("error from readMetricsFromFn", e));
}
