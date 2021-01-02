export type Expr = Inc
                 | Dec
                 | Left
                 | Right
                 | Get
                 | Put
                 | If;

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

export interface Get {
  type: 'Get',
}

export interface Put {
  type: 'Put',
}

export interface If {
  type: 'If',
  body: Program,
}
