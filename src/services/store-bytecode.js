import * as c from '../contract/contract.js';
import fs from 'fs';
import Web3 from 'web3';

const init = async (start, stop) => {
    try {
        const addresses = await c.getSolFromLocalStorage();
        addresses.slice(start, stop).forEach(async (address) => {
            const bc = address.replace(/.sol$/, '.bytecode');
            console.log(bc);
            if (!hasBytecode(bc)) {
                await storeBytecode(bc);
            }
        });
    } catch (e) {
        console.error('--- Error in storebytecode module ---', e);
    }
};

const hasBytecode = (bc) => fs.existsSync(bc);

const storeBytecode = async (bc) => {
    const address = bc.match(/(\w{42})/)[1];
    const web3 = new Web3(process.env.ETH_PROVIDER);
    const bytecode = await web3.eth.getCode(address);
    console.log(`Got the bytecode of ${address}`);
    fs.writeFileSync(bc, bytecode);
    web3.currentProvider.disconnect();
};

//init(1_200, 1_300);
init(77_000, 83_000);
