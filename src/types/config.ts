interface Entity {
  name: string,
  title: string,
}

interface Field extends Entity {
  help: string,
  condition: string,
}

interface Group extends Entity {
  fields: Field[],
}

interface Dialog extends Entity {
  help: {
    link: string,
  },
  groups: Group[],
}

interface SubMenu extends Entity {}

interface Menu extends Entity {
  subMenus: SubMenu[];
}

interface Constant {
  type: string,
  units: string,
  values: string[],
  min: number,
  max: number,
}

interface Constants {
  [name: string]: Constant,
}

interface Config {
  apiVersion: string,
  signature: string,
  constants: Constants,
  dialogs: Dialog[],
  menus: Menu[],
}

export type {
  Field,
  Group,
  Dialog,
  SubMenu,
  Menu,
  Constant,
  Constants,
  Config,
};
