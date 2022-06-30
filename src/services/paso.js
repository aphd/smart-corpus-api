import parser from '@solidity-parser/parser';

const commentRegExp = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g;

export default function paso(source, abi, bytecode, dest) {
    let ast_j, ast_s, result;
    const code = getCodeFromMultipleSC(source);
    const lines = code.split('\n');
    result = {
        contractAddress: dest.match(/(0x\w{40}).sol$/)?.[1] || 'NA',
        total_lines: lines.length || 'NA',
        LOC: getLOC(code),
        blanks: getBlanks(lines),
        comments: get_comments(code),
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
        result['rawVersion'] = getRawVersion(ast_s);
        result['version'] = getVersion(result['rawVersion']);
    } catch (error) {
        console.log(`Error in PASO parser: some value will be NA----, ${dest},\n${error}`);
        result['version'] = 'NA';
    }

    Object.entries(metrics).forEach(([key, value]) => {
        result[key] = ast_s ? (ast_s.match(new RegExp(value, 'gi')) || []).length : 'NA';
    });
    result['cyclomatic'] = getMCC(result);
    result['abiLength'] = getAbiLength(abi);
    result['abiStringLength'] = abi?.length || 'NA';
    result['bytecode'] = bytecode?.length > 0 ? bytecode?.length : 'NA';

    return result;
}

const getLOC = (code) => {
    code = code.replace(commentRegExp, '');
    return code.split('\n').filter((e) => !/^\s*$/.test(e)).length;
};

const getBlanks = (lines) => lines.filter((e) => /^\s*$/.test(e)).length;

const getAbiLength = (abi) => {
    if (!abi) return 'NA';
    let json;
    try {
        json = JSON.parse(abi);
    } catch (error) {
        return 'NA';
    }
    const l1_len = json.length;
    const l2_len = json.reduce((a, c) => (a += Object.keys(c).length), 0);
    return l1_len + l2_len;
};

const getCodeFromMultipleSC = (code) => {
    if (code.slice(0, 1) !== '{') return code;
    code = code.slice(0, 2) == '{{' ? code.substring(1).slice(0, -1) : code;
    const json = JSON.parse(code);
    const sources = Object.values(json.sources || json).map((e) => e.content);
    return sources.join('\n\n');
};

const get_comments = (code) => {
    const match = code.match(commentRegExp);
    return match ? match.length : 0;
};

const getRawVersion = (ast_s) => {
    const rawVersion = ast_s.match(/"name":"solidity","value":"(.*?)"/);
    return rawVersion ? rawVersion[1] : 'NA';
};

const getVersion = (rawVersion) => {
    if (/n\/a/.test(rawVersion)) return rawVersion;
    if (/<\d/.test(rawVersion)) {
        const max = rawVersion.match(/<(\d{1,}\.\d{1,}\.\d{1,})/)[1];
        const nums = max.split('.');
        nums[2] > 0 ? nums[2]-- : nums[1]--;
        return nums.join('.');
    }
    if (/>=/.test(rawVersion)) return rawVersion.match(/>=(\d{1,}\.\d{1,}\.\d{1,})/)[1];
    return rawVersion.replace(/^\^/, '').replace(/ /g, '');
};

const getMCC = (metrics) => {
    const controlStructures = [
        'functions',
        'ifStatement',
        'forStatement',
        'whileStatement',
        'doWhileStatement',
        'tryStatement',
    ];
    const mmcc = controlStructures.reduce((a, c) => a + metrics[c], 0);
    return typeof mmcc == 'number' ? mmcc : 'NA';
};

