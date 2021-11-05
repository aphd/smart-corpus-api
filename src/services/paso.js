import parser from "@solidity-parser/parser";

export default function paso(code) {
    let ast_j, ast_s, result;

    result = {
        comments: get_comments(code),
        blanks: code.match(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm).length,
    };
    const metrics = {
        addresses: '"type":"ElementaryTypeName","name":"address"',
        assemblyStatement: '"type":"assemblyStatement"',
        block: '"type":"block"',
        contracts_definition: '"type":"ContractDefinition"',
        contracts: '"kind":"contract"',
        doWhileStatement: '"type":"doWhileStatement"',
        emitStatement: '"type":"emitStatement"',
        events: '"type":"EventDefinition"',
        forStatement: '"type":"IfStatement"',
        functions: '"type":"FunctionDefinition"',
        ifStatement: '"type":"IfStatement"',
        inlineAssemblyStatement: '"type":"inlineAssemblyStatement"',
        interfaces: '"kind":"interface"',
        libraries: '"kind":"library"',
        mapping: '"type":"Mapping"',
        modifiers: '"type":"ModifierDefinition"',
        payable: '"stateMutability":"payable"',
        public: '"stateMutability":"public"',
        pure: '"stateMutability":"pure"',
        returnStatement: '"type":"returnStatement"',
        revertStatement: '"type":"revertStatement"',
        simpleStatement: '"type":"simpleStatement"',
        throwStatement: '"type":"throwStatement"',
        tryStatement: '"type":"tryStatement"',
        view: '"stateMutability":"view"',
        isVirtual: '"isVirtual":true',
        isFallback: '"isFallback":true',
        whileStatement: '"type":"whileStatement"',
    };

    try {
        ast_j = parser.parse(code, { loc: true });
        ast_s = JSON.stringify(ast_j);
        console.log('ast_s:', ast_s);
        result['version'] = get_version(ast_s);
        result['total_lines'] = ast_j.loc.end.line;
    } catch (error) {
        console.log(
            '----error in PASO parser: some value will be set to n/a---- '
        );
        result['version'] = 'n/a';
        result['total_lines'] = 'n/a';
    }

    Object.entries(metrics).forEach(([key, value]) => {
        result[key] = ast_s
            ? (ast_s.match(new RegExp(value, 'gi')) || []).length
            : 'n/a';
    });

    // console.log('result: ... ', result);
    // console.log('getMCC: ... ', getMCC(result));
    result['mmc'] = getMCC(result);

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
        /"name":"solidity","value":".*(\d{1,}.\d{1,}.\d{1,})"/
    );
    if (/<.*\d{1,}.\d{1,}.\d{1,}/.test(version[0])) {
        const nums = version[1].split('.');
        nums[2] > 0 ? nums[2]-- : nums[1]--;
        return nums.join('.');
    }
    return version ? version[1] : 'n/a';
};

const getMCC = (metrics) => {
    console.log('metrics:', metrics);
    const controlStructures = [
        'functions',
        'ifStatement',
        'forStatement',
        'whileStatement',
        'doWhileStatement',
        'tryStatement',
    ];
    return controlStructures.reduce((a, c) => a + metrics[c], 0);
};
