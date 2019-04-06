import { Token } from './common/types';
import { TokenType } from './common/enums';
import {
  FUNC,
  varRegExp,
  nameRegExp,
  ARROW,
  COLUMN,
  SEMICOLUMN,
  OPS
} from './common/syntax';

function getTokenType(str: string): TokenType {
  if (str === FUNC) {
    return TokenType.FnKeyword;
  } else if (varRegExp.test(str)) {
    return TokenType.Var;
  } else if (nameRegExp.test(str)) {
    return TokenType.Name;
  } else if (str === ARROW) {
    return TokenType.Arrow;
  } else if (str === COLUMN) {
    return TokenType.Column;
  } else if (str === SEMICOLUMN) {
    return TokenType.Semicolumn;
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
