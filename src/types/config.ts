interface Entity {
  name: string,
  title: string,
}

interface Field extends Entity {
  help: string,
  condition: string,
}

interface Panel {
  name: string,
  layout: string,
  condition: string,
}

interface Dialog extends Entity {
  layout: string,
  help: {
    link: string,
  },
  panels: {
    [name: string]: Panel,
  },
  fields: Field,
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
  type: 'scalar' | 'bits' | 'array',
  size: 'U08' | 'S08' | 'U16' | 'S16'
  offset: number,
  address: BitsAddress,
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

interface Config {
  apiVersion: string,
  signature: string,
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
  Panel,
  Dialog,
  SubMenu,
  Menu,
  ArrayShape,
  BitsAddress,
  Constant,
  Constants,
  Page,
  Config,
};
