import { Program, Expr } from './types';

type ParseExpr = Expr | { type: 'EndIf' };

// TODO
// 1. Program should parse but end up only processing actual exprs
// 2. How do you represent parsing empty characters?
// 3. How do you signal an error on no-matching-bracket?
// 4. What other errors should be signaled?

export function parse(prog: string): Program {
  const tokens: string[] = prog.split('').reverse();
  return parseTokens(tokens);
}

function parseTokens(tokens: string[]): Program {
  const prog: Program = [];
  while (tokens.length !== 0) {
    const tok: string = tokens.pop() as string;

    prog.push(parseExpr(tok, tokens));
  }

  return prog;
}

function parseExpr(c: string, tokens: string[]): ParseExpr {
  if (c === '+') {
    return { type: 'Increment' };
  } else if (c === '-') {
    return { type: 'Decrement' };
  } else if (c === '<') {
    return { type: 'Left' };
  } else if (c === '>') {
    return { type: 'Right' };
  } else if (c === ',') {
    return { type: 'Input' };
  } else if (c === '.') {
    return { type: 'Output' };
  } else if (c === '[') {
    return { type: 'If', body: parseTokens(tokens) };
  } else if (c === ']') {
    return { type: 'EndIf' };
  } else {
    // do nothing
    return '';
  }
}

