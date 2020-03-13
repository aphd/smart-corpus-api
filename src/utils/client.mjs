import axios from "axios";
import readCSV from "./read-csv.mjs";
import download from "./download.mjs";

// TODO to take from config-file
const server = "http://localhost:8080/";
const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";
const verified_address =
    "./src/csv/export-verified-contractaddress-opensource-license.csv";

const post_addresses = function() {
    const [fn, columns_to_skip] = [verified_address, ["Txhash"]];
    readCSV(fn, columns_to_skip).then(result =>
        axios.post(server, result).catch(error => console.log(error))
    );
};

const download_contracts = function() {
    const options = address => ({
        url: `${source}${address}`,
        dir: `./src/json/${address.substring(0, 4)}/`,
        fn: `${address}.json`
    });
    axios.get(server).then(function(response) {
        response.data.forEach(e =>
            download(options(e.contractAddress.toLowerCase()))
        );
    });
};

post_addresses();
// download_contracts();
