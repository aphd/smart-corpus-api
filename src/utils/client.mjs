import axios from "axios";
import { readAddresses, download, writeMetrics } from "./index.mjs";

// TODO to take from config-file
const server =
    'http://localhost:8080/{"$or":[  {"contractAddress":"0x9e1ae1cae3e9609626753086d4859cddc33f1cc8"}, {"contractAddress":"0x6fa85aa3f44f296de1294e3c097872235215b822"}]}';
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

const delayLoop = (fn, delay) => {
    return (x, i) => {
        setTimeout(() => {
            fn(x);
        }, i * delay);
    };
};

const download_contracts = function() {
    axios.get(server).then(function(response) {
        response.data.forEach(
            delayLoop(
                e => download(url_dir_fn(e.contractAddress.toLowerCase())),
                500
            )
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
// post_addresses();
// download_contracts();
write_metrics();
