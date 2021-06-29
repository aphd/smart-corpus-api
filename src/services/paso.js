import parse from "solidity-parser-diligence/dist/index.js";

export default function paso(code) {
    let ast_j, ast_s, result;

    result = {
        comments: get_comments(code),
        blanks: code.match(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm).length,
    };
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
        interfaces: '"kind":"interface"',
    };

    try {
        ast_j = parse.parse(code, { loc: true });
        ast_s = JSON.stringify(ast_j);
        result["version"] = get_version(ast_s);
        result["total_lines"] = ast_j.loc.end.line;
    } catch (error) {
        console.log("----error----", error);
        result["total_lines"] = "n/a";
        result["version"] = "n/a";
    }

    Object.entries(metrics).forEach(([key, value]) => {
        result[key] = ast_s
            ? (ast_s.match(new RegExp(value, "g")) || []).length
            : "n/a";
    });

    return result;
}

const get_comments = (code) => {
    const match = code.match(
        /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g
    );
    return match ? match.length : 0;
};

const get_version = (ast_s) => {
    let version = ast_s.match(
        /"name":"solidity","value":"\^(\d{1,}.\d{1,}.\d{1,})/
    );
    return version ? version[1] : "Not defined";
};
