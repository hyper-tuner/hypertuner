/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-shadow
export enum Switches {
  YES = 'Yes',
  NO = 'No',
  ON = 'On',
  OFF = 'Off',
}

interface Field {
  name: string,
  title: string,
  condition?: string,
}

interface Dialog {
  title: string,
  layout?: string,
  help?: string,
  panels: {
    [name: string]: Dialog,
  },
  fields: Field[],
  condition?: string,
}

interface Dialogs {
  [name: string]: Dialog,
}

interface SubMenu {
  title: string,
  page: number,
  condition: string,
}

interface Menu {
  title: string,
  subMenus: {
    [name: string]: SubMenu,
  },
}

interface Menus {
  [name: string]: Menu,
}

interface ArrayShape {
  columns: number,
  rows: number,
}

interface BitsAddress {
  from: number,
  to: number,
}

interface Constant {
  type: 'scalar' | 'bits' | 'array',
  size: 'U08' | 'S08' | 'U16' | 'S16'
  offset: number,
  address?: BitsAddress,
  units: string,
  scale: number,
  transform: number,
  min: number,
  max: number,
  digits: number,
  shape?: ArrayShape,
  values?: string[],
}

interface Constants {
  [name: string]: Constant,
}

interface Page {
  number: number,
  size: number,
  data: Constants,
}

interface Globals {
  [name: string]: string[],
}

interface Help {
  [key: string]: string,
}

interface Config {
  megaTune: {
    signature: string,
  },
  pcVariables: Constants,
  globals: Globals,
  constants: {
    pages: Page[],
  },
  dialogs: {
    [name: string]: Dialog,
  },
  menus: Menus,
  help: Help,
}

export type {
  Field,
  Dialog,
  Dialogs,
  SubMenu,
  Menu,
  Menus,
  ArrayShape,
  BitsAddress,
  Constant,
  Constants,
  Page,
  Globals,
  Help,
  Config,
};
