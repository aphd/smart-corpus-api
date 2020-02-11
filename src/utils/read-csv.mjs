import csv from "csv-parser";
import fs from "fs";

export default function readCSV(fn, callback) {
    const results = [];
    fs.createReadStream(fn)
        .pipe(csv({ separator: ";" }))
        .on("data", data => results.push(data))
        .on("end", () => {
            callback(results);
        });
}
