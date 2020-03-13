import parse from "solidity-parser-diligence/dist";

export default function paso(code) {
    const ast_j = parse.parse(code, { loc: true });
    const ast_s = JSON.stringify(ast_j);
    try {
        window.ast_j = ast_j;
    } catch {}

    const metrics = {
        mapping: '"type":"Mapping"',
        functions: '"type":"FunctionDefinition"',
        payable: '"stateMutability":"payable"',
        events: '"type":"EventDefinition"',
        modifiers: '"type":"ModifierDefinition"',
        contracts_definition: '"type":"ContractDefinition"',
        addresses: '"type":"ElementaryTypeName","name":"address"',
        contracts: '"kind":"contract"',
        libraries: '"kind":"library"',
        interfaces: '"kind":"interface"'
    };
    let result = {
        version: get_version(ast_s),
        total_lines: ast_j.loc.end.line,
        comments: get_comments(code),
        blanks: code.match(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm).length
    };
    for (const metric in metrics) {
        let reg = metrics[metric];
        result[metric] = (ast_s.match(new RegExp(reg, "g")) || []).length;
    }

    return result;
}

const get_comments = code => {
    const match = code.match(
        /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g
    );
    return match ? match.length : 0;
};

const get_version = ast_s => {
    let version = ast_s.match(
        /"name":"solidity","value":"\^(\d{1,}.\d{1,}.\d{1,})/
    );
    return version ? version[1] : "Not defined";
};
