import * as c from '../contract/contract.js';
import fs from 'fs';
import { exec } from 'child_process';

const init = async () => {
    try {
        const addresses = await c.getSolFromLocalStorage();
        addresses.slice(0, 10).forEach((address) => {
            const abi = address.replace(/.sol$/, '.bytecode');
            console.log(abi);
            if (!hasBytecode(abi)) {
                storeBytecode(address, abi);
            }
        });
    } catch (e) {
        console.error('--- Error in storebytecode module ---', e);
    }
};

const hasBytecode = (abi) => fs.existsSync(abi);

const storeBytecode = (sol, abi) => {
    console.log('sol, abi:', sol, abi);
    const cmd = `solc --bin ${sol} > ${abi}`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};

init();
