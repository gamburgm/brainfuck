export type Expr = Inc
                 | Dec
                 | Left
                 | Right
                 | Input
                 | Output;

export type Program = Expr[];

export interface Inc {
  type: 'Increment',
}

export interface Dec {
  type: 'Decrement',
}

export interface Left {
  type: 'Left',
}

export interface Right {
  type: 'Right',
}

export interface Input {
  type: 'Input',
}

export interface Output {
  type: 'Output',
}

export interface If {
  type: 'If',
  body: Program,
}
