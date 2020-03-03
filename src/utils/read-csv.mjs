import csv from "csv-parser";
import fs from "fs";

export default function readCSV(fn, callback) {
    const results = [];
    let keys = [];
    fs.createReadStream(fn)
        .pipe(csv({ separator: ";" }))
        .on("headers", headers => {
            keys = headers;
        })
        .on("data", data => {
            keys.map(key => {
                data[key] = isNaN(data[key])
                    ? data[key]
                    : parseFloat(data[key]);
            });
            data["address"] = "0x" + data["SolidityFile"].split("_")[0];
            results.push(data);
        })
        .on("end", () => {
            callback(results);
        });
}
