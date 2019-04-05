const input = 'add : a b => a + b';

enum TokenTypes {
  Up,
  Down,
  Left,
  Right
}

const getType = (item: string) => TokenTypes.Down;

const tokenize = (input: string) =>
  input.split(' ').map(item => ({
    type: getType(item),
    value: item
  }));

console.log(tokenize(input));
