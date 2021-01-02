import { Program, Expr } from './types';

type ParseExpr = Expr | { type: 'EndIf' };
type ParseProg = ParseExpr[];

const inputChars = ['+', '-', '<', '>', ',', '.', '[', ']'] as const;
type ProgInput = typeof inputChars[number];


// The REAL type is an Expr[] where it _might_ have a final EndIf.
// What if you returned a _type_ of return from parseTokens? That's probably the move.

// TODO
// 1. Program should parse but end up only processing actual exprs
// 2. How do you represent parsing empty characters?
// 3. How do you signal an error on no-matching-bracket?
// 4. What other errors should be signaled?

export function parse(prog: string): Program {
  // FIXME type narrowing isn't happening
  const tokens: ProgInput[] = prog.split('').reverse().filter(isProgInput);

  const parsed = parseTokens(tokens);

  return parseTokens(tokens);
}

function parseTokens(tokens: ProgInput[]): ParseProg {
  const prog: ParseProg = [];
  while (tokens.length !== 0) {
    // FIXME why does `pop` potentially return `undefined`?
    const tok: ProgInput = tokens.pop() as ProgInput;


    prog.push(parseExpr(tok, tokens));
  }

  return prog;
}

// FIXME type narrowing isn't happening
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
      const ifBlock: ParseProg = parseTokens(tokens);
      // FIXME what if ifBlock is empty?
      if (ifBlock[ifBlock.length - 1].type !== 'EndIf') {
        throw 'mismatched brackets!';
      } else {
        ifBlock.pop();
        // FIXME there's an IR for parsing and an IR for the actual program, and need to convert between them somehow
        return { type: 'If', body: ifBlock as Program };
      }
    case ']':
      return { type: 'EndIf' };
  }
}

function isProgInput(c: string): c is ProgInput {
  return c in inputChars;
}

// handling matching brackets works by doing the following:
// ALWAYS include the parsed EndIf expr.
// - if you see it in parseProgram, fail, there's too many closes.
// - if you don't see it at the end of a parsed If, then fail, not enough closes.
// REMEMBER that you _always_ pop out of the current parse if you see a closing bracket OR end of input.
