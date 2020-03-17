import axios from "axios";
import { readAddresses, download, writeMetrics } from "./index.mjs";

// TODO to take from config-file
const server = "http://localhost:8080/";
const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";

const post_addresses = function() {
    readAddresses(["Txhash"]).then(result =>
        axios.post(server, result).catch(e => console.log(e.response.data))
    );
};

const url_dir_fn = contractAddress => ({
    url: `${source}${contractAddress}`,
    dir: `./src/json/${contractAddress.substring(0, 4)}/`,
    fn: `${contractAddress}.json`
});

const download_contracts = function() {
    axios.get(server).then(function(response) {
        response.data.forEach(e =>
            download(url_dir_fn(e.contractAddress.toLowerCase()))
        );
    });
};

const write_metrics = function() {
    axios
        .get(server)
        .then(function(response) {
            response.data.forEach(e => {
                const contractAddress = e.contractAddress.toLowerCase();
                let { dir, fn } = url_dir_fn(contractAddress);
                writeMetrics(dir + fn, contractAddress);
            });
        })
        .catch(e => console.log(e));
};

post_addresses(); //create address entries in mongodb
//download_contracts();
//write_metrics();
