interface Constant {
  value: string | number,
}

interface Constants {
  [name: string]: Constant,
}

interface Tune {
  constants: Constants,
}

export type {
  Tune,
  Constant,
  Constants,
};
