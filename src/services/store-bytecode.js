import * as c from '../contract/contract.js';
import fs from 'fs';
import Web3 from 'web3';

const init = async () => {
    try {
        const addresses = await c.getSolFromLocalStorage();
        addresses.slice(0, 6).forEach(async (address) => {
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
    let web3 = new Web3(process.env.ETH_PROVIDER);
    const bytecode = await web3.eth.getCode(address);
    console.log(`Got the bytecode of ${address}\n`);
    fs.writeFileSync(bc, bytecode);
};

init();
