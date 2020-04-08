import { writeMetrics2CSV, writeMetrics2JSON } from "./handle-metrics.js";
import { downloadContracts } from "./handle-contracts.js";

downloadContracts();
// writeMetrics2CSV();
// writeMetrics2JSON();
/* To get the distinct/unique values in metric files run this bash script

    FN="./data/metrics.csv"; \
    FNU="$FN.u"; \
    (head -n 1 $FN && tail -n +2 $FN  | sort)  | uniq >  $FNU; \
    mv $FNU $FN

*/
// missing writeMetricsFromCsvToJson
