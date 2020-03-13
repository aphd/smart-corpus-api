import csv from "csv-parser";
import fs from "fs";

export default function readCSV(fn, columns_to_skip) {
    const results = [];
    return new Promise(resolve =>
        fs
            .createReadStream(fn)
            .pipe(
                csv({
                    mapHeaders: ({ header, index }) => {
                        if (
                            columns_to_skip &&
                            columns_to_skip.includes(header)
                        ) {
                            return null;
                        }
                        return header.charAt(0).toLowerCase() + header.slice(1);
                    },
                    separator: ","
                })
            )
            .on("data", data => {
                // data["address"] = "0x" + data["SolidityFile"].split("_")[0];
                results.push(data);
            })
            .on("end", () => {
                resolve(results);
            })
    );
}
