import axios from "axios";
import { readAddresses, download, paso } from "./index.mjs";

// TODO to take from config-file
const server = "http://localhost:8080/";
const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";

const post_addresses = function() {
    const columns_to_skip = ["Txhash"];
    readAddresses(columns_to_skip).then(result =>
        axios.post(server, result).catch(error => console.log(error))
    );
};

const url_dir_fn = address => ({
    url: `${source}${address}`,
    dir: `./src/json/${address.substring(0, 4)}/`,
    fn: `${address}.json`
});

const download_contracts = function() {
    axios.get(server).then(function(response) {
        response.data.forEach(e =>
            download(url_dir_fn(e.contractAddress.toLowerCase()))
        );
    });
};

const write_metrics = function() {
    axios.get(server).then(function(response) {
        response.data.forEach(e => {
            const address = e.contractAddress.toLowerCase();
            console.log(address);
        });
    });
};

//post_addresses();
download_contracts();
//write_metrics();
