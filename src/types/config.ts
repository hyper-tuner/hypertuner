interface Entity {
  name: string,
  title: string,
}

interface Field extends Entity {
  help?: string,
  condition?: string,
}

interface Dialog extends Entity {
  layout: string,
  help?: {
    link: string,
  },
  panels: {
    [name: string]: Dialog,
  },
  fields: Field[],
  condition?: string,
}

interface Dialogs {
  [name: string]: Dialog,
}

interface SubMenu extends Entity {}

interface Menu extends Entity {
  subMenus: SubMenu[];
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
  name: string,
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
  shape: ArrayShape,
  values: string[],
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

interface Config {
  megaTune: {
    signature: string,
  },
  globals: Globals,
  constants: {
    pages: Page[],
  },
  dialogs: {
    [name: string]: Dialog,
  },
  menus: Menu[],
}

export type {
  Field,
  Dialog,
  Dialogs,
  SubMenu,
  Menu,
  ArrayShape,
  BitsAddress,
  Constant,
  Constants,
  Page,
  Globals,
  Config,
};
