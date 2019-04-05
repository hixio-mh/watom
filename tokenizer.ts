enum TokenType {
  Arrow,
  Column,
  Name,
  Opcode,
  Var
}

interface Token {
  type: TokenType;
  value: string;
}

// vars must be lowercase letters of length 1
const varRegExp = /^([a-z]){1,1}$/;
// vars must be lowercase letters of length at least 2
const nameRegExp = /^([a-z]){2,}$/;
const opCodes = ['+', '-', '/', '*'];
const ARROW = '=>';
const COLUMN = ':';

function getTokenType(str: string): TokenType {
  if (varRegExp.test(str)) {
    return TokenType.Var;
  } else if (nameRegExp.test(str)) {
    return TokenType.Name;
  } else if (str === ARROW) {
    return TokenType.Arrow;
  } else if (str === COLUMN) {
    return TokenType.Column;
  } else if (opCodes.includes(str)) {
    return TokenType.Opcode;
  }
  throw Error('Parsing error!');
}

function tokenize(input: string): Array<Token> {
  return input.split(' ').map(str => {
    const token: Token = {
      type: getTokenType(str),
      value: str
    };
    return token;
  });
}

export default tokenize;
