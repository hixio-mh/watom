import tokenize from './tokenizer';
import parse from './parser';

const input = 'fn add : a b => + a b';
const tokens = tokenize(input);
const ast = parse(tokens);

console.table(tokens);
console.log(ast);
