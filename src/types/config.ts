export enum Switches {
  YES = 'Yes',
  NO = 'No',
  ON = 'On',
  OFF = 'Off',
}

export interface Field {
  name: string
  title: string
  condition?: string
}

export interface Dialog {
  title: string
  layout: string
  help?: string
  panels: {
    [name: string]: Dialog
  }
  fields: Field[]
  condition: string
}

export interface Dialogs {
  [name: string]: Dialog
}

export interface SubMenu {
  title: string
  page: number
  condition: string
}

export interface Menu {
  title: string
  subMenus: {
    [name: string]: SubMenu
  }
}

export interface Menus {
  [name: string]: Menu
}

export interface ArrayShape {
  columns: number
  rows: number
}

export interface BitsAddress {
  from: number
  to: number
}

export interface ScalarConstant {
  type: 'scalar' | 'bits' | 'array'
  size: 'U08' | 'S08' | 'U16' | 'S16'
  offset: number
  units: string
  scale: number
  transform: number
  min: number
  max: number
  digits: number
}

export interface Constant extends ScalarConstant {
  address?: BitsAddress
  shape?: ArrayShape
  values?: string[]
}

export interface Constants {
  [name: string]: Constant
}

export interface Page {
  number: number
  size: number
  data: Constants
}

export interface Globals {
  [name: string]: string[]
}

export interface Help {
  [key: string]: string
}

export interface Curve {
  title: string
  condition: string
  labels: string[]
  xAxis: number[]
  yAxis: number[]
  xBins: string[]
  yBins: string
  size: number[]
  gauge: string
}

export interface Config {
  megaTune: {
    signature: string
  }
  pcVariables: Constants
  globals: Globals
  constants: {
    pages: Page[]
  }
  dialogs: {
    [name: string]: Dialog
  }
  curves: {
    [name: string]: Curve
  }
  outputChannels: {
    [name: string]: ScalarConstant
  }
  menus: Menus
  help: Help
}
