interface Entity {
  name: string,
  title: string,
}

interface Field extends Entity {
  help: string,
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
  unit: string,
  values: string[] | number[],
  min: number,
  max: number,
}

interface Config {
  apiVersion: string,
  signature: string,
  constants: {
    [name: string]: Constant,
  },
  dialogs: Dialog[],
  menus: any,
}

export type {
  Field,
  Group,
  Dialog,
  SubMenu,
  Menu,
  Constant,
  Config,
};
