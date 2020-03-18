const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";

export default function urlDirFn(contractAddress) {
    return {
        url: `${source}${contractAddress}`,
        dir: `./src/json/${contractAddress.substring(0, 4)}/`,
        fn: `${contractAddress}.json`
    };
}
