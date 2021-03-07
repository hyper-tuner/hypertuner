export enum Switches {
  YES = 'Yes',
  NO = 'No',
  ON = 'On',
  OFF = 'Off',
}

export interface Field {
  name: string;
  title: string;
  condition?: string;
}

export interface Panel {
  title?: string;
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
  condition: string;
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

export interface BitsAddress {
  from: number;
  to: number;
}

export enum ConstantTypes {
  SCALAR = 'scalar',
  BITS = 'bits',
  ARRAY = 'array',
}

export type ConstantSize = 'U08' | 'S08' | 'U16' | 'S16';

export interface ScalarConstant {
  type: ConstantTypes.SCALAR;
  size: ConstantSize;
  offset: number;
  units: string;
  scale: number;
  transform: number;
  min: number;
  max: number;
  digits: number;
}

export interface BitsConstant {
  type: ConstantTypes.BITS;
  size: ConstantSize;
  offset: number;
  address: BitsAddress;
  values: string[];
}

export interface ArrayConstant {
  type: ConstantTypes.ARRAY;
  size: ConstantSize;
  offset: number;
  shape: ArrayShape;
  units: string;
  scale: number;
  transform: number;
  min: number;
  max: number;
  digits: number;
}

export type Constant = ScalarConstant | BitsConstant | ArrayConstant;

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
  condition?: string;
}

export interface Table {
  name: string;
  map: string;
  title: string;
  page: number;
  help: string;
  xBins: string[];
  yBins: string[];
  xyLabels: string[];
  zBins: string[];
  gridHeight: number;
  gridOrient: number[];
  upDownLabel: string[];
  condition?: string;
}

export interface Config {
  [key: string]: any;
  megaTune: {
    signature: string;
  };
  tunerStudio: {
    iniSpecVersion: number;
  };
  defines: {
    [name: string]: string[];
  };
  pcVariables: Constants;
  constants: {
    pages: Page[];
  };
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
  menus: Menus;
  help: Help;
}
