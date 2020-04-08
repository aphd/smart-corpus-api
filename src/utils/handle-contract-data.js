const source =
    "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";

const contractDir = "./data/contracts/";

export function getUrlFromAddr(contractAddress) {
    return `${source}${contractAddress}&apikey=${process.env.API_KEY}`;
}

export function getFnFromAddr(contractAddress) {
    return `${contractAddress}.json`;
}

export function getDirFromAddr(contractAddress) {
    return `${contractDir}/${contractAddress.substring(0, 4)}/`;
}

export function getDestFromAddr(contractAddress) {
    return getDirFromAddr(contractAddress) + getFnFromAddr(contractAddress);
}

export function getSourceCode(data) {
    const sourceCode = data.result[0].SourceCode;
    try {
        const nestedSourceCode = JSON.parse(sourceCode);
        return nestedSourceCode[
            Object.keys(nestedSourceCode)[
                Object.keys(nestedSourceCode).length - 1
            ]
        ].content;
    } catch (e) {
        return sourceCode;
    }
}
