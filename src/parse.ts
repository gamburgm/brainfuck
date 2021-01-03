import { Program, Expr } from './types';

type ParseExpr = Expr | { type: 'EndIf' };

interface ParseResult {
  prog: Program,
  hadBracket: boolean,
}

const inputChars = ['+', '-', '<', '>', ',', '.', '[', ']'] as const;
type ProgInput = typeof inputChars[number];

export function parse(text: string): Program {
  const tokens: ProgInput[] = text.split('').reverse().filter(isProgInput);

  const { prog, hadBracket }  = parseTokens(tokens);
  if (hadBracket) {
    throw 'mismatched brackets!';
  } else {
    return prog;
  }
}

function parseTokens(tokens: ProgInput[]): ParseResult {
  const prog: Program = [];
  while (tokens.length !== 0) {
    const tok: ProgInput = tokens.pop() as ProgInput;
    const parsedExpr = parseExpr(tok, tokens);

    if (parsedExpr.type === 'EndIf') {
      return { prog, hadBracket: true };
    } else {
      prog.push(parsedExpr);
    }
  }

  return { prog, hadBracket: false };
}

function parseExpr(c: ProgInput, tokens: ProgInput[]): ParseExpr {
  // FIXME why does `switch` work when `if` doesn't?
  switch (c) {
    case '+':
      return { type: 'Increment' };
    case '-':
      return { type: 'Decrement' };
    case '<':
      return { type: 'Left' };
    case '>':
      return { type: 'Right' };
    case ',':
      return { type: 'Get' };
    case '.':
      return { type: 'Put' };
    case '[':
      const { prog, hadBracket } = parseTokens(tokens);
      if (hadBracket) {
        return { type: 'If', body: prog };
      } else {
        throw 'mismatched brackets!';
      }
    case ']':
      return { type: 'EndIf' };
  }
}

function isProgInput(c: string): c is ProgInput {
  return c in inputChars;
}
