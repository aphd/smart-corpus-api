import { writeMetrics2CSV } from "./handle-metrics.js";
import { downloadContracts } from "./handle-contracts.js";
import shell from "shelljs";
const fn_metric = "./data/metrics.csv";

downloadContracts();
writeMetrics2CSV()
    .then((res) => console.log(res))
    // TODO shell.exec is executed before writeMetrics2CSV
    .then(() => shell.exec(`./src/services/remove-duplicates.sh ${fn_metric}`))
    .catch((e) => console.error(e));
