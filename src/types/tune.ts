export interface Constant {
  units?: string;
  value: string | number;
}

export interface Constants {
  [name: string]: Constant;
}

export interface Tune {
  constants: Constants;
}
