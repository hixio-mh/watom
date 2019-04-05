const input = 'add : a b => a + b';

enum TokenType {
  Opcode,
  Name,
  Arrow,
  Column,
  Var
}

interface Token {
  type: TokenType;
  value: string;
}

function getTokenType(item: string): TokenType {
  switch (item) {
    case 'a':
      return TokenType.Var;
      break;
    case 'b':
      return TokenType.Var;
      break;
    default:
      return TokenType.Column;
      break;
  }
}

const tokenize = (input: string) =>
  input.split(' ').map(item => {
    const token: Token = {
      type: getTokenType(item),
      value: item
    };
    return token;
  });

console.log(tokenize(input));
