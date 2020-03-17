import axios from "axios";
import { postAddresses, downloadContracts, writeMetrics } from "./index.mjs";

// TODO to take from config-file

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
// postAddresses();
downloadContracts();
//write_metrics();
