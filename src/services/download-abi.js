import https from 'https';
import fs from 'fs';
import * as c from '../contract/contract.js';

const endpoint = 'https://api.etherscan.io/api?module=contract&action=getabi&address=';

const getAbiUrl = (address) => `${endpoint}${address}&apikey=${process.env.API_KEY}`;

const download = (address) => {
    const url = getAbiUrl(address);
    const dir = c.getDirFromAddr(address);
    const dest = `/tmp/${address}.abi`;
    https.get(url, function (response) {
        const isGoodResponse = response.headers['content-length'] > 150;
        if (!isGoodResponse) return null; // it avoids writing an empty file when the token has exceeded the request limit
        let file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
            const abi = JSON.parse(fs.readFileSync(dest, 'utf8')).result;
            const abiDest = `${dir}${address}.abi`;
            console.log('abiDest:', abiDest);
            fs.writeFileSync(abiDest, abi);
        });
    });
};

const getAddresses = async () => {
    const [START, END] = [60_000, 80_000];
    const sols = await c.getSolFromLocalStorage();
    // const sols = ['data/contracts/0x00/0x001D77351daD0cD3f696c67EbBa5Bda0C11d0Db1.sol'];
    for (const sol of sols.slice(START, END)) {
        const address = sol.match(/0x\w{40}/)?.[0];
        if (!address) continue;
        const abiFn = sol.replace(/.sol$/, '.abi');
        const doesExist = fs.existsSync(abiFn);
        if (doesExist) continue;
        await new Promise((r) => setTimeout(r, 500));
        await download(address);
    }
};

// downloadContracts();
getAddresses();

