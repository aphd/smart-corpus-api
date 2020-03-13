import paso from "./paso";
import fs from "fs";

// TODO import from a conf file
const fn_metric = "./src/csv/paso_metric.csv";

export default function writeMetrics(dest) {
    fs.existsSync(dest) &&
        fs.readFile(dest, (err, data) => {
            if (err) throw err;
            console.log(dest);
            console.log(paso(JSON.parse(data).result[0].SourceCode));
        });
}
