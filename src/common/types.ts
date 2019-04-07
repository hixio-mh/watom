import { TokenType } from './enums';

export interface Token {
  type: TokenType;
  value: string;
}

export interface AstItemExtended {
  item: object;
  increment: number;
}
