import { Program, Expr } from './types';

type ParseExpr = Expr | { type: 'EndIf' };

const inputChars = ['+', '-', '<', '>', ',', '.', '[', ']'] as const;
type ProgInput = typeof inputChars[number];

// TODO
// 1. Program should parse but end up only processing actual exprs
// 2. How do you represent parsing empty characters?
// 3. How do you signal an error on no-matching-bracket?
// 4. What other errors should be signaled?

export function parse(prog: string): Program {
  // FIXME type narrowing isn't happening
  const tokens: ProgInput[] = prog.split('').reverse().filter((c: string) => c in inputChars);
  return parseTokens(tokens);
}

function parseTokens(tokens: ProgInput[]): Program {
  const prog: Program = [];
  while (tokens.length !== 0) {
    const tok: string = tokens.pop() as string;

    prog.push(parseExpr(tok, tokens));
  }

  return prog;
}

// FIXME type narrowing isn't happening
function parseExpr(c: ProgInput, tokens: ProgInput[]): ParseExpr {
  if (c === '+') {
    return { type: 'Increment' };
  } else if (c === '-') {
    return { type: 'Decrement' };
  } else if (c === '<') {
    return { type: 'Left' };
  } else if (c === '>') {
    return { type: 'Right' };
  } else if (c === ',') {
    return { type: 'Get' };
  } else if (c === '.') {
    return { type: 'Put' };
  } else if (c === '[') {
    return { type: 'If', body: parseTokens(tokens) };
  } else if (c === ']') {
    return { type: 'EndIf' };
}

// handling matching brackets works by doing the following:
// ALWAYS include the parsed EndIf expr.
// - if you see it in parseProgram, fail, there's too many closes.
// - if you don't see it at the end of a parsed If, then fail, not enough closes.
// REMEMBER that you _always_ pop out of the current parse if you see a closing bracket OR end of input.
