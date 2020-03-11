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
    const API_KEY = "E5KM3HIGE2PV4RR763IQSXGZIV6UV638P2";
    const address = "0x1d5ad987b743eb624662fe5c62b8f6015554203a";
    const action = "getsourcecode";
    let url = `https://api.etherscan.io/api?module=contract&action=${action}&address=${address}&apikey=${API_KEY}`;

    let dir = `./src/json/${address.substring(0, 4)}/`;
    let fn = `${address}.json`;
    download(url, dir, fn, par => console.log(par));
};

get_contracts();
