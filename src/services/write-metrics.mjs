import paso from "./paso";
import fs from "fs";
import ObjectsToCsv from "objects-to-csv";

// TODO import from a conf file
const fn_metric = "./src/csv/paso_metric.csv";

const getSourceCode = data => {
    const sourceCode = JSON.parse(data).result[0].SourceCode;
    try {
        const nestedSourceCode = JSON.parse(sourceCode);
        return nestedSourceCode[
            Object.keys(nestedSourceCode)[
                Object.keys(nestedSourceCode).length - 1
            ]
        ].content;
    } catch {
        return sourceCode;
    }
};

// get metrics from solidity source code
const get_json_metrics_from_sol = dest =>
    new Promise(resolve =>
        fs.readFile(dest, (err, data) => {
            resolve(paso(getSourceCode(data)));
        })
    );

export default function writeMetrics(dest, contractAddress) {
    fs.existsSync(dest) &&
        get_json_metrics_from_sol(dest).then(data => {
            data.contractAddress = contractAddress;
            const csv = new ObjectsToCsv([data]);
            csv.toDisk(fn_metric, { append: true }); // Save to file:
        });
}
