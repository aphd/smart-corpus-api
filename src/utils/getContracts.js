import csv from "csv-parser";
import fs from "fs";

const verified_address_fn = "/tmp/contracts.csv";

export default function getContracts(columns_to_skip) {
    const results = [];
    return new Promise((resolve) =>
        fs
            .createReadStream(verified_address_fn)
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
                    separator: ",",
                })
            )
            .on("data", (data) => {
                results.push(data);
            })
            .on("end", () => {
                resolve(results);
            })
    );
}
