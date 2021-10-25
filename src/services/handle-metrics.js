import paso from "./paso.js";
import fs from "fs";
import { promises as pfs } from 'fs';
import csv from "csvtojson";
import ObjectsToCsv from "objects-to-csv";
import * as c from "../contract/contract.js";

// TODO import from a conf file
const fn_metric = "./data/metrics.csv";
const fn_metric_json = "./data/metrics.json";

const getJsonMetricsFromSol = async (dest) => {
    const data = await pfs.readFile(dest, "utf8");
    try {
        return (paso(data));
    } catch (e) {
        console.log("Paso error in: ", dest);
    }
 }

const writeMetricsSingleContract = async (dest) => {
    const doesExist = fs.existsSync(dest);
    if (!doesExist) return null;
    const data = await getJsonMetricsFromSol(dest)
    if(!data) return null;
    data['contractAddress'] = dest.match(/(0x\w{40}).sol$/)?.[1];;
    const csv = new ObjectsToCsv([data]);
    await csv.toDisk(fn_metric, { append: true, header: false });
};

const writeMetrics2CSV = async () => {
    const sols = await c.getSolFromLocalStorage();
    console.log(sols.length)
    await sols.slice(0, 10_000).forEach(async (sol) => await writeMetricsSingleContract(sol));
};

const writeMetrics2JSON = () =>
    csv({ checkType: true })
        .fromFile(fn_metric)
        .then((r) => fs.writeFileSync(fn_metric_json, JSON.stringify(r)));

const writeMetrics = (type) =>
    type === "csv" ? writeMetrics2CSV() : writeMetrics2JSON();

export default writeMetrics;

writeMetrics(process.argv.slice(2)[0]);
