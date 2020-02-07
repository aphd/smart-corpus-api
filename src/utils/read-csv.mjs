import csv from "csv-parser";
import fs from "fs";

export default function readCSV(fn, callback) {
    const results = [];
    fs.createReadStream(fn)
        .pipe(csv())
        .on("data", data =>
            results.push({
                hash: data["ContractAddress"],
                name: data["ContractName"]
            })
        )
        .on("end", () => {
            callback(results);
        });
}
