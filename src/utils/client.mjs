import postRequest from "./post-request.mjs";
import axios from "axios";
import readCSV from "./read-csv.mjs";
import download from "./download.mjs";

const read_csv = function() {
    const w_callback = data => {
        console.log(data);
        // postRequest(JSON.stringify(data));
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

const download_contracts = function() {
    const options = address => ({
        url: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}`,
        dir: `./src/json/${address.substring(0, 4)}/`,
        fn: `${address}.json`
    });
    axios.get("http://localhost:8080/").then(function(response) {
        response.data.forEach(e =>
            download(options(e.contractAddress.toLowerCase()))
        );
    });
};

read_csv();
