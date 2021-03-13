export enum Switches {
  YES = 'Yes',
  NO = 'No',
  ON = 'On',
  OFF = 'Off',
}

export interface Field {
  title: string;
  name: string;
  condition?: string;
}

export interface Panel {
  layout: string;
  panels?: {
    [name: string]: Panel;
  };
  fields?: Field[];
  condition?: string;
}

export interface Dialog {
  title: string;
  layout: string;
  help?: string;
  panels: {
    [name: string]: Panel;
  };
  fields: Field[];
  // TODO:
  // settingSelector
  // commandButton
}

export interface Dialogs {
  [name: string]: Dialog;
}

export interface SubMenu {
  title: string;
  page: number;
  condition: string;
}

export interface Menu {
  title: string;
  subMenus: {
    [name: string]: SubMenu;
  };
}

export interface Menus {
  [name: string]: Menu;
}

export interface ArrayShape {
  columns: number;
  rows: number;
}

export enum ConstantTypes {
  SCALAR = 'scalar',
  BITS = 'bits',
  ARRAY = 'array',
  STRING = 'string',
}

export type ConstantSize = 'U08' | 'S08' | 'U16' | 'S16' | 'U32' | 'S32' | 'S64' | 'F32' | 'ASCII';

export interface ScalarConstant {
  type: ConstantTypes.SCALAR;
  size: ConstantSize;
  offset?: number;
  units: string;
  scale: number | string;
  transform: number | string;
  min: number | string;
  max: number | string;
  digits: number;
}

export interface BitsConstant {
  type: ConstantTypes.BITS;
  size: ConstantSize;
  offset?: number;
  address: number[];
  values: string[];
}

export interface ArrayConstant {
  type: ConstantTypes.ARRAY;
  size: ConstantSize;
  offset?: number;
  shape: ArrayShape;
  units: string;
  scale: number | string;
  transform: number | string;
  min: number | string;
  max: number | string;
  digits: number;
}

export interface StringConstant {
  type: ConstantTypes.SCALAR;
  size: ConstantSize;
  length: number;
}

export type Constant = ScalarConstant | BitsConstant | ArrayConstant | StringConstant;

export interface Constants {
  [name: string]: Constant;
}

export interface Page {
  number: number;
  size: number;
  data: Constants;
}

export interface Help {
  [key: string]: string;
}

export interface Curve {
  title: string;
  labels: string[];
  xAxis: number[];
  yAxis: number[];
  xBins: string[];
  yBins: string[];
  size: number[];
  gauge?: string;
}

export interface Table {
  map: string;
  title: string;
  page: number;
  help?: string;
  xBins: string[];
  yBins: string[];
  xyLabels: string[];
  zBins: string[];
  gridHeight: number;
  gridOrient: number[];
  upDownLabel: string[];
}

export interface Config {
  [key: string]: any;
  megaTune: {
    [key: string]: any;
    signature: string;
    MTversion: number;
    queryCommand: string;
    versionInfo: string;
  };
  tunerStudio: {
    [key: string]: any;
    iniSpecVersion: number;
  };
  pcVariables: Constants;
  constants: {
    pages: Page[];
  };
  defines: {
    [name: string]: string[];
  };
  menus: Menus;
  help: Help;
  dialogs: {
    [name: string]: Dialog;
  };
  curves: {
    [name: string]: Curve;
  };
  tables: {
    [name: string]: Table;
  };
  outputChannels: {
    [name: string]: ScalarConstant | BitsConstant;
  };
}
