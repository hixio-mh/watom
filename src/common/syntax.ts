export const ARROW = '=>';
export const COLUMN = ':';
export const SEMICOLUMN = ';';
export const FUNC = 'fn';
// in watom input, vars must be lowercase letters of length 1
export const varRegExp = /^([a-z]){1,1}$/;
// in watom input, names must be lowercase letters of length at least 2
export const nameRegExp = /^([a-z]){3,}$/;
// in watom only these operations are supported
export const OPS = Object.freeze(['+', '-', '/', '*']);
