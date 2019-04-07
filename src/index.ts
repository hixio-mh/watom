import tokenize from './tokenizer';
import parse from './parser';

const input = 'fn add : a b => + a b';
const tokens = tokenize(input);
const ast = parse(tokens);

console.table(tokens);
console.log(JSON.stringify(ast));

const ast2 = {
  type: 2,
  body: [
    {
      name: 'add',
      type: 1,
      params: [{ type: 3, value: 'a' }, { type: 3, value: 'b' }],
      returnValue: {
        type: 0,
        value: {
          type: 4,
          operator: '+',
          operands: [{ type: 3, value: 'a' }, { type: 3, value: 'b' }]
        }
      }
    }
  ]
};
