import paso from "./paso.js";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";
import { getAddresses } from "./index.js";
import { getDestFromAddr } from "../utils/index.js";
import { getSourceCode } from "../utils/index.js";

// TODO import from a conf file
const fn_metric = "./src/csv/contracts-metrics.csv";

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
            csv.toDisk(fn_metric, { append: true }); // Save to file:
        });
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
    console.log(fn_metric);
}
