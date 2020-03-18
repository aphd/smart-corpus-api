import paso from "./paso.js";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";
import { getAddresses } from "./index.js";

// TODO import from a conf file
const fn_metric = "./src/csv/paso_metric.csv";

const get_json_metrics_from_sol = dest =>
    new Promise(resolve =>
        fs.readFile(dest, (err, data) => {
            resolve(paso(getSourceCode(data)));
        })
    );

const writeMetricsOfOneContract = (dest, contractAddress) =>
    fs.existsSync(dest) &&
    get_json_metrics_from_sol(dest).then(data => {
        data.contractAddress = contractAddress;
        const csv = new ObjectsToCsv([data]);
        csv.toDisk(fn_metric, { append: true }); // Save to file:
    });

export default function writeMetrics() {
    getAddresses()
        .then(function(response) {
            response.data.forEach(e => {
                const contractAddress = e.contractAddress.toLowerCase();
                let { dir, fn } = urlDirFn(contractAddress);
                writeMetricsOfOneContract(dir + fn, contractAddress);
            });
        })
        .catch(e => console.log(e));
}
