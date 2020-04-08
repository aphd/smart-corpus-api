import { downloadContracts, writeMetrics } from "./index.js";

downloadContracts();
writeMetrics();
/* To get the distinct/unique values in metric files run this bash script

    FN="./data/metrics.csv"; \
    FNU="$FN.u"; \
    (head -n 1 $FN && tail -n +2 $FN  | sort)  | uniq >  $FNU; \
    mv $FNU $FN

*/
// missing writeMetricsFromCsvToJson
