import csv from "csv-parser";
import fs from "fs";

const verified_address =
    "./src/csv/export-verified-contractaddress-opensource-license.csv";

export default function readAddresses(columns_to_skip) {
    const results = [];
    return new Promise(resolve =>
        fs
            .createReadStream(verified_address)
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
