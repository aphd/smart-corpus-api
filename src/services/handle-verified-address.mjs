import csv from "csv-parser";
import fs from "fs";
import axios from "axios";

const verified_address =
    "./src/csv/export-verified-contractaddress-opensource-license.csv";

const server = "http://localhost:8080/";

export default function postVerifiedAddresses() {
    readAddresses(["Txhash"]).then(result =>
        axios.post(server, result).catch(e => console.log(e.response.data))
    );
}

const readAddresses = columns_to_skip => {
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
                results.push(data);
            })
            .on("end", () => {
                resolve(results);
            })
    );
};
