import smacPost from "./post-request.mjs";
import readCSV from "./read-csv.mjs";

const w_callback = data => {
    smacPost(JSON.stringify(data));
};
// readCSV("/tmp/smec.test.csv", w_callback); // https://github.com/aphd/solidity-metrics/blob/master/examples/smec.csv

readCSV("./src/csv/export-verified-contractaddress-opensource-license.csv", {
    callback: w_callback,
    columns_to_skip: ["Txhash"]
});
