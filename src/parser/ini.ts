import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {
  Config as ConfigType,
  Constant,
  ConstantSize as ConstantSizeType,
  ScalarConstant as ScalarConstantType,
  BitsConstant as BitsConstantType,
  ConstantTypes,
  ArrayConstant as ArrayConstantType,
} from '../types/config';

console.log('------- start --------');

class Parser {
  COMMENTS_PATTERN: string;

  CONDITION_PATTERN: string;

  DIALOG_PATTERN: RegExp;

  DIALOG_TOPIC_PATTERN: RegExp;

  PANEL_PATTERN: RegExp;

  FIELD_PATTERN: RegExp;

  FIELD_TEXT_PATTERN: RegExp;

  PAGE_PATTERN: RegExp;

  CONSTANT_BASE_PATTERN: string;

  PC_VARIABLE_BASE_PATTERN: string;

  SCALAR_BASE_PATTERN: string;

  CONSTANT_FIRST_PATTERN: RegExp;

  CONSTANT_SCALAR_PATTERN: RegExp;

  CONSTANT_BITS_PATTERN: RegExp;

  CONSTANT_ARRAY_PATTERN: RegExp;

  PC_VARIABLE_FIRST_PATTERN: RegExp;

  PC_VARIABLE_SCALAR_PATTERN: RegExp;

  PC_VARIABLE_BITS_PATTERN: RegExp;

  PC_VARIABLE_ARRAY_PATTERN: RegExp;

  OUTPUT_CHANNELS_FIRST_PATTERN: RegExp;

  OUTPUT_CHANNELS_SCALAR_PATTERN: RegExp;

  OUTPUT_CHANNELS_BITS_PATTERN: RegExp;

  SECTION_HEADER_PATTERN: RegExp;

  KEY_VALUE_PATTERN: RegExp;

  DEFINE_PATTERN: RegExp;

  MENU_PATTERN: RegExp;

  SUB_MENU_PATTERN: RegExp;

  CURVE_PATTERN: RegExp;

  CURVE_LABELS_PATTERN: RegExp;

  CURVE_X_AXIS_PATTERN: RegExp;

  CURVE_Y_AXIS_PATTERN: RegExp;

  CURVE_X_BINS_PATTERN: RegExp;

  CURVE_Y_BINS_PATTERN: RegExp;

  CURVE_SIZE_PATTERN: RegExp;

  CURVE_GAUGE_PATTERN: RegExp;

  lines: string[];

  currentPage: number;

  currentDialog: string;

  currentPanel: string;

  currentMenu: string;

  currentCurve: string;

  result: ConfigType;

  constructor(buffer: string) {
    this.COMMENTS_PATTERN = '\\s*(?<comments>;.+)*';
    this.CONDITION_PATTERN = '\\s*,*\\s*(?<condition>{.+?}?)*';

    this.DIALOG_PATTERN = new RegExp(`^dialog\\s*=\\s*(?<name>\\w+)\\s*,*\\s*"(?<title>.*)"\\s*,*\\s*(?<layout>.+)*${this.COMMENTS_PATTERN}$`);
    this.DIALOG_TOPIC_PATTERN = new RegExp(`^topicHelp\\s*=\\s*"(?<help>.+)"${this.COMMENTS_PATTERN}$`);
    this.PANEL_PATTERN = new RegExp(`^panel\\s*=\\s*(?<name>\\w+)\\s*,*\\s*(?<layout>\\w+|{})*\\s*,*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.FIELD_PATTERN = new RegExp(`^field\\s*=\\s*"(?<title>.*)"\\s*,*\\s*(?<name>[\\w[\\]]+)*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.FIELD_TEXT_PATTERN = new RegExp(`^field\\s*=\\s*"(?<title>.*)"${this.COMMENTS_PATTERN}$`);
    this.PAGE_PATTERN = new RegExp(`^page\\s*=\\s*(?<page>\\d+)${this.COMMENTS_PATTERN}$`);

    this.CONSTANT_BASE_PATTERN = '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*\\s*(?<offset>\\d+)';
    this.PC_VARIABLE_BASE_PATTERN = '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*';
    this.SCALAR_BASE_PATTERN = '\\s*"(?<units>.*)"\\s*,*\\s*(?<scale>[\\-\\d.]+)\\s*,*\\s*(?<transform>[\\-\\d.]+)\\s*,*\\s*(?<min>[\\-\\d.]+)*\\s*,*\\s*(?<max>[\\-\\d.]+)*\\s*,*\\s*(?<digits>[\\d.]+)*';

    this.CONSTANT_FIRST_PATTERN  = new RegExp(`${this.CONSTANT_BASE_PATTERN}.+`);
    this.CONSTANT_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.CONSTANT_BITS_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\]\\s*,\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
    this.CONSTANT_ARRAY_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<shape>.+)\\]\\s*,*${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.PC_VARIABLE_FIRST_PATTERN  = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}.+`);
    this.PC_VARIABLE_SCALAR_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.PC_VARIABLE_BITS_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}\\s*\\[(?<from>\\d+):(?<to>\\d+)\\],\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
    this.PC_VARIABLE_ARRAY_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}\\s*\\[(?<shape>.+)\\]\\s*,*${this.SCALAR_BASE_PATTERN}\\s*,*\\s*(?<extra>\\w+)*${this.COMMENTS_PATTERN}$`);

    this.OUTPUT_CHANNELS_FIRST_PATTERN  = new RegExp(`${this.CONSTANT_BASE_PATTERN}.+`);
    this.OUTPUT_CHANNELS_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN}\\s*,*\\s*"(?<units>.*)"\\s*,*\\s*(?<scale>[\\-\\d.]+)\\s*,*\\s*(?<transform>[\\-\\d.]+)${this.COMMENTS_PATTERN}$`);
    // this.OUTPUT_CHANNELS_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},*\\s*"(?<units>.*)"|(?<units2>{.+?}?),*\\s*(?<scale>[\\-\\d.]+),\\s*(?<transform>[\\-\\d.]+)${this.COMMENTS_PATTERN}$`);
    this.OUTPUT_CHANNELS_BITS_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\]${this.COMMENTS_PATTERN}$`);

    this.SECTION_HEADER_PATTERN = new RegExp(`^\\[(?<section>[A-z]+)]${this.COMMENTS_PATTERN}$`);
    this.KEY_VALUE_PATTERN = new RegExp(`^(?<key>\\w+)\\s*=\\s*"*(?<value>.+?)"*${this.COMMENTS_PATTERN}$`);

    this.DEFINE_PATTERN = new RegExp(`^#\\s*define\\s*(?<key>\\w+)\\s*=\\s*"*(?<value>.+?)"*${this.COMMENTS_PATTERN}$`);

    this.MENU_PATTERN = new RegExp(`^menu\\s*=\\s*"(?<menu>.+)"${this.COMMENTS_PATTERN}$`);
    this.SUB_MENU_PATTERN = new RegExp(`^subMenu\\s*=\\s*(?<name>\\w+)\\s*,*\\s+"(?<title>.+)"\\s*,*\\s*(?<page>\\d+)*\\s*,*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.CURVE_PATTERN = new RegExp(`^curve\\s*=\\s*(?<name>\\w+)\\s*,*\\s*"(?<title>.+)${this.COMMENTS_PATTERN}"`);
    this.CURVE_LABELS_PATTERN = new RegExp(`^columnLabel\\s*=\\s*(?<labels>.+)${this.COMMENTS_PATTERN}`);
    this.CURVE_X_AXIS_PATTERN = new RegExp(`^xAxis\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);
    this.CURVE_Y_AXIS_PATTERN = new RegExp(`^yAxis\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);
    this.CURVE_X_BINS_PATTERN = new RegExp(`^xBins\\s*=\\s*(?<values>.+)${this.COMMENTS_PATTERN}`);
    this.CURVE_Y_BINS_PATTERN = new RegExp(`^yBins\\s*=\\s*(?<value>.+)${this.COMMENTS_PATTERN}`);
    this.CURVE_SIZE_PATTERN = new RegExp(`^size\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);
    this.CURVE_GAUGE_PATTERN = new RegExp(`^gauge\\s*=\\s*(?<value>.+)${this.COMMENTS_PATTERN}`);

    this.lines = buffer.toString().split('\n');
    this.currentPage = 1;
    this.currentDialog = 'NONE';
    this.currentPanel = 'NONE';
    this.currentMenu = 'NONE';
    this.currentCurve = 'NONE';

    this.result = {
      megaTune: {
        signature: '',
      },
      tunerStudio: {
        iniSpecVersion: 0,
      },
      defines: {},
      pcVariables: {},
      constants: {
        pages: [],
      },
      menus: {},
      dialogs: {},
      curves: {},
      outputChannels: {},
      help: {},
    };
  }

  parse() {
    this.parseSections();

    return this.result;
  }

  // TODO: fix Idle advance mode in dwell settings

  parseSections() {
    let section: string;

    this.lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith(';')) {
        return;
      }

      const matches = trimmed.match(this.SECTION_HEADER_PATTERN);
      if (matches) {
        // console.log('Found section:', matches.groups.section);
        section = matches.groups!.section;
      } else if (section) {
        this.parseSectionLine(section, trimmed);
      }
    });
  }

  parseSectionLine(section: string, line: string) {
    switch (section) {
      case 'PcVariables':
        this.parsePcVariables(line);
        break;
      case 'Constants':
        this.parseConstants(line);
        break;
      case 'Menu':
        this.parseMenu(line);
        break;
      case 'SettingContextHelp':
        this.parseKeyValue('help', line);
        break;
      case 'UserDefined':
        this.parseDialogs(line);
        break;
      case 'CurveEditor':
        this.parseCurves(line);
        break;
      case 'OutputChannels':
        this.parseOutputChannels(line);
        break;
      default:
        // TODO: rename sections, and do not use default, only explicit sections
        this.parseKeyValue(section, line);
        break;
    }
  }

  parseCurves(line: string) {
    let match = line.match(this.CURVE_PATTERN);
    if (match) {
      this.currentCurve = match.groups!.name;
      this.result.curves[this.currentCurve] = {
        title: match.groups!.title,
        labels: [],
        xAxis: [],
        yAxis: [],
        xBins: [],
        yBins: '',
        size: [],
        gauge: '',
        condition: '',
      };
    }

    match = line.match(this.CURVE_LABELS_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].labels = match.groups!.labels
        .split(',').map(Parser.sanitizeString);
    }

    match = line.match(this.CURVE_X_AXIS_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].xAxis = match.groups!.values
        .split(',').map(Number);
    }

    match = line.match(this.CURVE_Y_AXIS_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].yAxis = match.groups!.values
        .split(',').map(Number);
    }

    match = line.match(this.CURVE_X_BINS_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].xBins = match.groups!.values
        .split(',').map(Parser.sanitizeString);
    }

    match = line.match(this.CURVE_Y_BINS_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].yBins
        = Parser.sanitizeString(match.groups!.value);
    }

    match = line.match(this.CURVE_SIZE_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].size = match.groups!.values
        .split(',').map(Number);
    }

    match = line.match(this.CURVE_GAUGE_PATTERN);
    if (match) {
      this.result.curves[this.currentCurve].gauge
        = Parser.sanitizeString(match.groups!.value);
    }
  }

  parseOutputChannels(line: string) {
    this.parseDefines(line);

    const [name, rest] = line.split('=').map((part) => part.trim());

    // not a constant - TODO: #if else
    if (!rest) {
      return;
    }

    const matchConstant = rest.match(this.OUTPUT_CHANNELS_FIRST_PATTERN);
    // TODO: ochGetCommand    = "r\$tsCanId\x30%2o%2c"
    if (!matchConstant || !matchConstant.groups) {
      return;
    }

    // if / else
    if (name in this.result.outputChannels) {
      return;
    }

    let constant: Constant;
    switch (matchConstant.groups.type) {
      case ConstantTypes.SCALAR:
        constant = Parser.parseScalar(rest, this.OUTPUT_CHANNELS_SCALAR_PATTERN);
        break;
      case ConstantTypes.BITS:
        constant = this.parseBits(rest, this.OUTPUT_CHANNELS_BITS_PATTERN);
        break;
      default:
        throw new Error(`Unsupported type: ${matchConstant.groups.type}`);
    }

    this.result.outputChannels[name] = constant;
  }

  parsePcVariables(line: string) {
    this.parseDefines(line);

    const [name, rest] = line.split('=').map((part) => part.trim());

    // not a constant - TODO: #if else
    if (!rest) {
      return;
    }

    const matchConstant = rest.match(this.PC_VARIABLE_FIRST_PATTERN);
    if (!matchConstant) {
      return;
    }

    // TODO: handle this somehow
    // TODO: LAMBDA:
    // wueAFR = array, S16,  [10], "Lambda", { 0.1 / stoich }, 0.000, -0.300, 0.300, 3
    // key already exists - IF ELSE most likely
    // if (name in this.result.pcVariables) {
    //   return;
    // }

    let constant;
    switch (matchConstant.groups!.type) {
      case 'scalar':
        constant = Parser.parseScalar(rest, this.PC_VARIABLE_SCALAR_PATTERN);
        break;
      case 'array':
        constant = Parser.parseArray(rest, this.PC_VARIABLE_ARRAY_PATTERN);
        break;
      case 'bits':
        constant = this.parseBits(rest, this.PC_VARIABLE_BITS_PATTERN);
        break;
      default:
        throw new Error(`Unsupported type: ${matchConstant.groups!.type}`);
    }

    this.result.pcVariables[name] = constant;
  }

  parseDefines(line: string) {
    const match = line.match(this.DEFINE_PATTERN);
    if (match) {
      this.result.defines[match.groups!.key] = match.groups!.value.split(',')
        .map(Parser.sanitizeString);

      const resolved = this.result.defines[match.groups!.key].map((val) => (
        val.startsWith('$')
          ? this.result.defines[val.slice(1)]
          : val
        )).flat();

      this.result.defines[match.groups!.key] = resolved;
    }
  }

  parseKeyValue(section: string, line: string) {
    const match = line.match(this.KEY_VALUE_PATTERN);
    if (!match) {
      return;
    }

    const sectionName = `${section.charAt(0).toLowerCase()}${section.slice(1)}`;
    if (!this.result[sectionName]) {
      // do not add section that are not explicitly defined
      return;
    }

    this.result[sectionName][match.groups!.key] = Number.isNaN(Number(match.groups!.value))
      ? match.groups!.value.trim()
      : Number(match.groups!.value);
  }

  parseDialogs(line: string) {
    const matchDialog = line.match(this.DIALOG_PATTERN);
    if (matchDialog) {
      this.currentDialog = matchDialog.groups!.name;
      this.result.dialogs[this.currentDialog] = {
        title: matchDialog.groups!.title,
        layout: matchDialog.groups!.layout || '',
        panels: {},
        fields: [],
        condition: '',
      };

      return;
    }

    const matchHelp = line.match(this.DIALOG_TOPIC_PATTERN);
    if (matchHelp) {
      this.result.dialogs[this.currentDialog].help = matchHelp.groups!.help;

      return;
    }

    const matchPanel = line.match(this.PANEL_PATTERN);
    if (matchPanel) {
      this.currentPanel = matchPanel.groups!.name;
      this.result.dialogs[this.currentDialog].panels[this.currentPanel] = {
        layout: matchPanel.groups!.layout || '',
        condition: Parser.sanitizeCondition(matchPanel.groups!.condition || ''),
      };

      return;
    }

    // TODO:
    // {
    //   name: { egoType },
    //   ...
    // }
    const matchField = line.match(this.FIELD_PATTERN);
    if (matchField) {
      this.result.dialogs[this.currentDialog].fields.push({
        name: matchField.groups!.name ? Parser.sanitizeString(matchField.groups!.name) : '_fieldText_',
        title: Parser.sanitizeString(matchField.groups!.title),
        condition: Parser.sanitizeCondition(matchField.groups!.condition || ''),
      });
    }
  }

  parseConstants(line: string) {
    this.parseDefines(line);

    const pageMatch = line.match(this.PAGE_PATTERN);
    if (pageMatch) {
      this.currentPage = Number(pageMatch.groups!.page);
      this.result.constants.pages[this.currentPage - 1] = {
        number: this.currentPage,
        size: 111,
        data: {},
      };

      return;
    }

    const [name, rest] = line.split('=').map((part) => part.trim());

    // not a constant - TODO: #if else
    if (!rest) {
      return;
    }

    const match = rest.match(this.CONSTANT_FIRST_PATTERN);
    if (!match) {
      return;
    }

    // TODO: handle this somehow
    // key already exists - IF ELSE most likely
    if (name in this.result.constants.pages[this.currentPage - 1].data) {
      return;
    }

    let constant;
    switch (match.groups!.type) {
      case ConstantTypes.SCALAR:
        constant = Parser.parseScalar(rest, this.CONSTANT_SCALAR_PATTERN);
        break;
      case ConstantTypes.ARRAY:
        constant = Parser.parseArray(rest, this.CONSTANT_ARRAY_PATTERN);
        break;
      case ConstantTypes.BITS:
        // TODO: handle this case
        if (name === 'unused_fan_bits') {
          return;
        }
        constant = this.parseBits(rest, this.CONSTANT_BITS_PATTERN);
        break;

      default:
        throw new Error(`Unsupported type: ${match.groups!.type}`);
    }

    this.result.constants.pages[this.currentPage - 1].data[name] = constant;
  }

  parseMenu(line: string) {
    const menuMatch = line.match(this.MENU_PATTERN);
    if (menuMatch) {
      const title = menuMatch.groups!.menu.replace(/&/g, '');
      const name = title
        .toLowerCase()
        .replace(/([^\w]\w)/g, (g) => g[1].toUpperCase()); // camelCase

      this.currentMenu = name;

      this.result.menus[this.currentMenu] = {
        title,
        subMenus: {},
      };

      return;
    }

    const subMenuMatch = line.match(this.SUB_MENU_PATTERN);
    if (subMenuMatch) {
      this.result.menus[this.currentMenu].subMenus[subMenuMatch.groups!.name] = {
        title: subMenuMatch.groups!.title,
        page: Number(subMenuMatch.groups!.page || 0),
        condition: Parser.sanitizeCondition(subMenuMatch.groups!.condition || ''),
      };
    }
  }

  parseBits(input: string, pattern: RegExp): BitsConstantType {
    const match = input.match(pattern);
    if (!match) {
      throw new Error(`Unable to parse bits: ${input}`);
    }

    let values = match.groups!.values
      ? match.groups!.values
        .split(',')
        .map((val: string) => val.replace(/"/g, '').trim())
      : [];

    values = values.map((val: string) => (
      val.startsWith('$')
        ? this.result.defines[val.slice(1)]
        : val
    )).flat();

    return {
      type: ConstantTypes.BITS,
      size: match.groups!.size as ConstantSizeType,
      offset: Number(match.groups!.offset || 0),
      address: {
        from: Number(match.groups!.from),
        to: Number(match.groups!.to),
      },
      values,
    };
  }

  static parseScalar(input: string, pattern: RegExp): ScalarConstantType {
    const match = input.match(pattern);
    if (!match) {
      // throw new Error(`Unable to parse scalar: ${input}`);
      return {} as ScalarConstantType;
    }

    return {
      type: ConstantTypes.SCALAR,
      size: match.groups!.size as ConstantSizeType,
      offset: Number(match.groups!.offset || 0),
      units: match.groups!.units,
      scale: Number(match.groups!.scale),
      transform: Number(match.groups!.transform),
      min: Number(match.groups!.min) || 0,
      max: Number(match.groups!.max) || 0,
      digits: Number(match.groups!.digits) || 0,
    };
  }

  static parseArray(input: string, pattern: RegExp): ArrayConstantType {
    const match = input.match(pattern);
    if (!match) {
      // throw new Error(`Unable to parse array: ${input}`);
      return {} as ArrayConstantType;
    }
    const [columns, rows] = match.groups!.shape
      .split('x')
      .map((val: string) => val.trim());

    return {
      type: ConstantTypes.ARRAY,
      size: match.groups!.size as ConstantSizeType,
      offset: Number(match.groups!.offset || 0),
      shape: {
        columns: Number(columns),
        rows: Number(rows || 0),
      },
      units: match.groups!.units,
      scale: Number(match.groups!.scale),
      transform: Number(match.groups!.transform),
      min: Number(match.groups!.min),
      max: Number(match.groups!.max),
      digits: Number(match.groups!.digits),
    };
  }

  static sanitizeComments = (val: string) => (val || '').replace(';', '').trim();

  static sanitizeString = (val: string) => val.replace(/"/g, '').trim();

  static stripComments = (val: string) => val.replace(/(\s*;.+$)/, '');

  static sanitizeCondition = (val: string) => val.replace(/^{\s*|\s*}$/g, '').trim();
}

const version = 202012;
// const version = 202103;

const result = new Parser(
  fs.readFileSync(path.join(__dirname, `/../../public/tunes/${version}.ini`), 'utf8'),
).parse();

// console.dir(result.pcVariables, { maxArrayLength: 10, depth: null });

fs.writeFileSync(path.join(__dirname, `/../../public/tunes/${version}.yml`), yaml.dump(result));
fs.writeFileSync(path.join(__dirname, `/../../public/tunes/${version}.json`), JSON.stringify(result));

console.log('------- end --------');