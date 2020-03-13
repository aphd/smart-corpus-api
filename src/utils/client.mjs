import axios from "axios";
import { readAddresses, download, writeMetrics } from "./index.mjs";

// TODO to take from config-file
const server = "http://localhost:8080/";
const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";

const post_addresses = function() {
    readAddresses(["Txhash"]).then(result =>
        axios.post(server, result).catch(e => console.log(e))
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
    axios
        .get(server)
        .then(function(response) {
            response.data.forEach(e => {
                let { dir, fn } = url_dir_fn(e.contractAddress.toLowerCase());
                writeMetrics(dir + fn);
            });
        })
        .catch(e => console.log(e));
};

//post_addresses();
//download_contracts();
write_metrics();
