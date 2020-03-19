import csv from "csv-parser";
import fs from "fs";
import axios from "axios";

const verified_address_fn =
    "./src/csv/export-verified-contractaddress-opensource-license.csv";

const server = "http://localhost:8080/";

export function postAddresses() {
    readAddressesFromFn(["Txhash"]).then(result =>
        axios.post(server, result).catch(e => console.log(e))
    );
}

export function getAddresses() {
    return axios.get(server);
}

const readAddressesFromFn = columns_to_skip => {
    const results = [];
    return new Promise(resolve =>
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
