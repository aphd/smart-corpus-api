import paso from './paso.js';
import fs from 'fs';
import { promises as pfs } from 'fs';
import csv from 'csvtojson';
import ObjectsToCsv from 'objects-to-csv';
import * as c from '../contract/contract.js';

const [START, END] = [3_000, 10_000];

// TODO import from a conf file
const fn_metric = './data/metrics.csv';
const fn_metric_json = './data/metrics.json';

const getJsonMetricsFromSol = async (dest) => {
    const code = await pfs.readFile(dest, 'utf8');
    const abi = await getAbi(dest);
    const bytecode = await getBytecode(dest);
    try {
        return paso(cleanCode(code), abi, bytecode, dest);
    } catch (e) {
        console.log(`N. Paso error in: ${dest}`);
    }
};

const getBytecode = async (dest) => {
    const bytecode = dest.replace(/.sol$/i, '.bytecode');
    if (!fs.existsSync(bytecode)) return undefined;
    return await pfs.readFile(bytecode, 'utf8');
};

const getAbi = async (dest) => {
    const abi = dest.replace(/.sol$/i, '.abi');
    if (!fs.existsSync(abi)) return undefined;
    return await pfs.readFile(dest.replace(/.sol$/i, '.abi'), 'utf8');
};

const writeMetricsSingleContract = async (dest) => {
    const doesExist = fs.existsSync(dest);
    if (!doesExist) return null;
    const data = await getJsonMetricsFromSol(dest);
    if (!data) return null;
    const csv = new ObjectsToCsv([data]);
    await csv.toDisk(fn_metric, { append: true, header: true });
};

const cleanCode = (code) => {
    code = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return code.replace(/\t/g, '');
};

const writeMetrics2CSV = async () => {
    const sols = await c.getSolFromLocalStorage();
    // const sols = ['test.sol'];
    await sols.slice(START, END).forEach(async (sol) => await writeMetricsSingleContract(sol));
};

const writeMetrics2JSON = () =>
    csv({ checkType: true })
        .fromFile(fn_metric)
        .then((r) => fs.writeFileSync(fn_metric_json, JSON.stringify(r)));

const writeMetrics = (type) => (type === 'csv' ? writeMetrics2CSV() : writeMetrics2JSON());

export default writeMetrics;

writeMetrics(process.argv.slice(2)[0]);

