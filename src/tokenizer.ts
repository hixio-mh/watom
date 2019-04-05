import { Token } from './common/types';
import { TokenType } from './common/enums';

// vars must be lowercase letters of length 1
const varRegExp = /^([a-z]){1,1}$/;
// names must be lowercase letters of length at least 2
const nameRegExp = /^([a-z]){2,}$/;
// only these operations are supported
const OPS = Object.freeze(['+', '-', '/', '*']);
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
  } else if (OPS.includes(str)) {
    return TokenType.Operator;
  } else {
    throw SyntaxError(`Watom doesn't know what ${str} is.`);
  }
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
