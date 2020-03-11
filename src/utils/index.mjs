import smacPost from "./post-request.mjs";
import readCSV from "./read-csv.mjs";
import download from "./download.mjs";

const read_csv = function() {
    const w_callback = data => {
        smacPost(JSON.stringify(data));
    };
    // readCSV("/tmp/smec.test.csv", w_callback); // https://github.com/aphd/solidity-metrics/blob/master/examples/smec.csv

    readCSV(
        "./src/csv/export-verified-contractaddress-opensource-license.csv",
        {
            callback: w_callback,
            columns_to_skip: ["Txhash"]
        }
    );
};

const get_contracts = function() {
    const address = "0x32c222efe25af3619a7494c4428b1a287731a447";
    const action = "getsourcecode";
    let url = `https://api.etherscan.io/api?module=contract&action=${action}&address=${address}`;
    let dir = `./src/json/${address.substring(0, 4)}/`;
    let fn = `${address}.json`;
    download(url, dir, fn, par => console.log(par));
};

get_contracts();
