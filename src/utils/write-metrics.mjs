import paso from "./paso";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";

// TODO import from a conf file
const fn_metric = "./src/csv/paso_metric.csv";

// get metrics from solidity source code
const get_json_metrics_from_sol = dest =>
    fs.existsSync(dest) &&
    new Promise(resolve =>
        fs.readFile(dest, (err, data) => {
            if (err) throw err;
            resolve(paso(JSON.parse(data).result[0].SourceCode));
        })
    );

export default function writeMetrics(dest) {
    get_json_metrics_from_sol(dest).then(data => {
        const csv = new ObjectsToCsv([data]);
        csv.toDisk(fn_metric, { append: true }); // Save to file:
    });
}
