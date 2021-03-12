import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import * as P from 'parsimmon';

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

class INI {
//   COMMENTS_PATTERN: string;

//   CONDITION_PATTERN: string;

//   DIALOG_PATTERN: RegExp;

//   HELP_PATTERN: RegExp;

//   PANEL_PATTERN: RegExp;

//   FIELD_PATTERN: RegExp;

//   FIELD_TEXT_PATTERN: RegExp;

//   PAGE_PATTERN: RegExp;

//   CONSTANT_BASE_PATTERN: string;

//   PC_VARIABLE_BASE_PATTERN: string;

//   SCALAR_BASE_PATTERN: string;

//   CONSTANT_FIRST_PATTERN: RegExp;

//   CONSTANT_SCALAR_PATTERN: RegExp;

//   CONSTANT_BITS_PATTERN: RegExp;

//   CONSTANT_ARRAY_PATTERN: RegExp;

//   PC_VARIABLE_FIRST_PATTERN: RegExp;

//   PC_VARIABLE_SCALAR_PATTERN: RegExp;

//   PC_VARIABLE_BITS_PATTERN: RegExp;

//   PC_VARIABLE_ARRAY_PATTERN: RegExp;

//   OUTPUT_CHANNELS_FIRST_PATTERN: RegExp;

//   OUTPUT_CHANNELS_SCALAR_PATTERN: RegExp;

//   OUTPUT_CHANNELS_BITS_PATTERN: RegExp;

//   SECTION_HEADER_PATTERN: RegExp;

//   KEY_VALUE_PATTERN: RegExp;

//   DEFINE_PATTERN: RegExp;

//   MENU_PATTERN: RegExp;

//   SUB_MENU_PATTERN: RegExp;

//   CURVE_PATTERN: RegExp;

//   CURVE_LABELS_PATTERN: RegExp;

//   CURVE_X_AXIS_PATTERN: RegExp;

//   CURVE_Y_AXIS_PATTERN: RegExp;

//   X_BINS_PATTERN: RegExp;

//   Y_BINS_PATTERN: RegExp;

//   Z_BINS_PATTERN: RegExp;

//   CURVE_SIZE_PATTERN: RegExp;

//   CURVE_GAUGE_PATTERN: RegExp;

//   TABLE_PATTERN: RegExp;

//   TABLE_LABELS_PATTERN: RegExp;

//   TABLE_UP_DW_LABELS_PATTERN: RegExp;

//   TABLE_HEIGHT_PATTERN: RegExp;

//   TABLE_ORIENT_PATTERN: RegExp;

  space: P.Parser<any>;

  expression: P.Parser<any>;

  numbers: P.Parser<any>;

  equal: P.Parser<any>;

  quote: P.Parser<any>;

  comma: P.Parser<any>;

  size: P.Parser<any>;

  delimiter: P.Parser<any>[];

  lines: string[];

  currentPage?: number;

  currentDialog?: string;

  currentPanel?: string;

  currentMenu?: string;

  currentCurve?: string;

  currentTable?: string;

  result: ConfigType;

  constructor(buffer: string) {
//     this.COMMENTS_PATTERN = '\\s*(?<comments>;.+)*';
//     this.CONDITION_PATTERN = '\\s*,*\\s*(?<condition>{.+?}?)*';

//     this.HELP_PATTERN = new RegExp(`^topicHelp\\s*=\\s*"(?<help>.+)"${this.COMMENTS_PATTERN}$`);

//     this.DIALOG_PATTERN = new RegExp(`^dialog\\s*=\\s*(?<name>\\w+)\\s*,*\\s*"(?<title>.*)"\\s*,*\\s*(?<layout>.+)*${this.COMMENTS_PATTERN}$`);
//     this.PANEL_PATTERN = new RegExp(`^panel\\s*=\\s*(?<name>\\w+)\\s*,*\\s*(?<layout>\\w+|{})*\\s*,*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);

//     this.FIELD_PATTERN = new RegExp(`^field\\s*=\\s*"(?<title>.*)"\\s*,*\\s*(?<name>[\\w[\\]]+)*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);
//     this.FIELD_TEXT_PATTERN = new RegExp(`^field\\s*=\\s*"(?<title>.*)"${this.COMMENTS_PATTERN}$`);
//     this.PAGE_PATTERN = new RegExp(`^page\\s*=\\s*(?<page>\\d+)${this.COMMENTS_PATTERN}$`);

//     this.CONSTANT_BASE_PATTERN = '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*\\s*(?<offset>\\d+)';
//     this.PC_VARIABLE_BASE_PATTERN = '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*';
//     this.SCALAR_BASE_PATTERN = '\\s*"(?<units>.*)"\\s*,*\\s*(?<scale>[\\-\\d.]+)\\s*,*\\s*(?<transform>[\\-\\d.]+)\\s*,*\\s*(?<min>[\\-\\d.]+)*\\s*,*\\s*(?<max>[\\-\\d.]+)*\\s*,*\\s*(?<digits>[\\d.]+)*';

//     this.CONSTANT_FIRST_PATTERN  = new RegExp(`${this.CONSTANT_BASE_PATTERN}.+`);
//     this.CONSTANT_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
//     this.CONSTANT_BITS_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\]\\s*,\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
//     this.CONSTANT_ARRAY_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<shape>.+)\\]\\s*,*${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);

//     this.PC_VARIABLE_FIRST_PATTERN  = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}.+`);
//     this.PC_VARIABLE_SCALAR_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
//     this.PC_VARIABLE_BITS_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}\\s*\\[(?<from>\\d+):(?<to>\\d+)\\],\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
//     this.PC_VARIABLE_ARRAY_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}\\s*\\[(?<shape>.+)\\]\\s*,*${this.SCALAR_BASE_PATTERN}\\s*,*\\s*(?<extra>\\w+)*${this.COMMENTS_PATTERN}$`);

//     this.OUTPUT_CHANNELS_FIRST_PATTERN  = new RegExp(`${this.CONSTANT_BASE_PATTERN}.+`);
//     this.OUTPUT_CHANNELS_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN}\\s*,*\\s*"(?<units>.*)"\\s*,*\\s*(?<scale>[\\-\\d.]+)\\s*,*\\s*(?<transform>[\\-\\d.]+)${this.COMMENTS_PATTERN}$`);
//     // this.OUTPUT_CHANNELS_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},*\\s*"(?<units>.*)"|(?<units2>{.+?}?),*\\s*(?<scale>[\\-\\d.]+),\\s*(?<transform>[\\-\\d.]+)${this.COMMENTS_PATTERN}$`);
//     this.OUTPUT_CHANNELS_BITS_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\]${this.COMMENTS_PATTERN}$`);

//     this.SECTION_HEADER_PATTERN = new RegExp(`^\\[(?<section>[A-z]+)]${this.COMMENTS_PATTERN}$`);
//     this.KEY_VALUE_PATTERN = new RegExp(`^(?<key>\\w+)\\s*=\\s*"*(?<value>.+?)"*${this.COMMENTS_PATTERN}$`);

//     this.DEFINE_PATTERN = new RegExp(`^#\\s*define\\s*(?<key>\\w+)\\s*=\\s*"*(?<value>.+?)"*${this.COMMENTS_PATTERN}$`);

//     this.MENU_PATTERN = new RegExp(`^menu\\s*=\\s*"(?<menu>.+)"${this.COMMENTS_PATTERN}$`);
//     this.SUB_MENU_PATTERN = new RegExp(`^subMenu\\s*=\\s*(?<name>\\w+)\\s*,*\\s+"(?<title>.+)"\\s*,*\\s*(?<page>\\d+)*\\s*,*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);

//     this.CURVE_PATTERN = new RegExp(`^curve\\s*=\\s*(?<name>\\w+)\\s*,*\\s*"(?<title>.+)"${this.COMMENTS_PATTERN}`);
//     this.CURVE_LABELS_PATTERN = new RegExp(`^columnLabel\\s*=\\s*(?<labels>.+)${this.COMMENTS_PATTERN}`);
//     this.CURVE_X_AXIS_PATTERN = new RegExp(`^xAxis\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);
//     this.CURVE_Y_AXIS_PATTERN = new RegExp(`^yAxis\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);
//     this.CURVE_SIZE_PATTERN = new RegExp(`^size\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);
//     this.CURVE_GAUGE_PATTERN = new RegExp(`^gauge\\s*=\\s*(?<value>.+)${this.COMMENTS_PATTERN}`);

//     this.X_BINS_PATTERN = new RegExp(`^xBins\\s*=\\s*(?<values>.+)${this.COMMENTS_PATTERN}`);
//     this.Y_BINS_PATTERN = new RegExp(`^yBins\\s*=\\s*(?<values>.+)${this.COMMENTS_PATTERN}`);
//     this.Z_BINS_PATTERN = new RegExp(`^zBins\\s*=\\s*(?<values>.+)${this.COMMENTS_PATTERN}`);

//     this.TABLE_PATTERN = new RegExp(`^table\\s*=\\s*(?<name>\\w+)\\s*,*\\s*(?<map>\\w+)\\s*,\\s*"(?<title>.+)"\\s*,\\s*(?<page>\\d+)${this.COMMENTS_PATTERN}`);
//     this.TABLE_LABELS_PATTERN = new RegExp(`^xyLabels\\s*=\\s*(?<values>.+)${this.COMMENTS_PATTERN}`);
//     this.TABLE_UP_DW_LABELS_PATTERN = new RegExp(`^upDownLabel\\s*=\\s*(?<values>.+)${this.COMMENTS_PATTERN}`);
//     this.TABLE_HEIGHT_PATTERN = new RegExp(`^gridHeight\\s*=\\s*(?<value>[\\d.]+)${this.COMMENTS_PATTERN}`);
//     this.TABLE_ORIENT_PATTERN = new RegExp(`^gridOrient\\s*=\\s*(?<values>[\\d,\\s]+)${this.COMMENTS_PATTERN}`);

    this.space = P.optWhitespace;
    this.expression = P.regexp(/{.+?}/);
    this.numbers = P.regexp(/[0-9.-]*/);
    this.equal = P.string('=');
    this.quote = P.string('"');
    this.comma = P.string(',');
    this.size = P.regexp(/U08|S08|U16|S16|U32|S32|S64|F32/);
    this.delimiter = [this.space, this.comma, this.space];

    this.lines = buffer.toString().split('\n');

    this.currentPage = undefined;
    this.currentDialog = undefined;
    this.currentPanel = undefined;
    this.currentMenu = undefined;
    this.currentCurve = undefined;
    this.currentTable = undefined;

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
      tables: {},
      outputChannels: {},
      help: {},
    };
  }

  parse() {
    this.parseSections();

    return this.result;
  }

//   // TODO: fix Idle advance mode in dwell settings

  parseSections() {
    let section: string;

    this.lines.forEach((raw) => {
      const line = raw.trim();
      // skip empty lines and lines with comments only
      // skip #EXPRESSION for now
      if (line === '' || line.startsWith(';') || line.startsWith('#')) {
        return;
      }

      const result = P
        .seqObj<any>(
          ['section', P.letters.wrap(P.string('['), P.string(']'))],
          P.all,
        ).parse(line);

        // top level section found
      if (result.status) {
        section = result.value.section.trim();
      } else if (section) {
        this.parseSectionLine(section, line);
      }
    });
  }

  parseSectionLine(section: string, line: string) {
    switch (section) {
      case 'PcVariables':
        // this.parsePcVariables(line);
        break;
      case 'Constants':
        this.parseConstants(line);
        break;
      case 'Menu':
        // this.parseMenu(line);
        break;
      case 'SettingContextHelp':
        // this.parseKeyValue('help', line);
        break;
      case 'UserDefined':
        // this.parseDialogs(line);
        break;
      case 'CurveEditor':
        // this.parseCurves(line);
        break;
      case 'TableEditor':
        // this.parseTables(line);
        break;
      case 'OutputChannels':
        // this.parseOutputChannels(line);
        break;
      default:
        // TODO: rename sections, and do not use default, only explicit sections
        // this.parseKeyValue(section, line);
        break;
    }
  }

  private parsePcVariables(line: string) {
    // '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*';
    //  `${this.PC_VARIABLE_BASE_PATTERN}.+`);
    // `${this.PC_VARIABLE_BASE_PATTERN}${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
    // `${this.PC_VARIABLE_BASE_PATTERN}\\s*\\[(?<from>\\d+):(?<to>\\d+)\\],\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
    // `${this.PC_VARIABLE_BASE_PATTERN}\\s*\\[(?<shape>.+)\\]\\s*,*${this.SCALAR_BASE_PATTERN}\\s*,*\\s*(?<extra>\\w+)*${this.COMMENTS_PATTERN}$`);

    // first common (eg. name = scalar, U08, 3,)
    const base: any = (type: string) => [
      ['name', P.regexp(/[0-9a-z_]*/i)],
      this.space, this.equal, this.space,
      ['type', P.string(type)],
      ...this.delimiter,
      ['size', this.size],
    ];

    // normal scalar
    const scalar = P.seqObj<any>(
      ...base('scalar'),
      ...this.delimiter,
    );

    const result = scalar.tryParse(line);

    console.dir(
      result,
      { depth: null, compact: false },
    );
  }

  private parseConstants(line: string) {
    const page = P
      .seqObj<any>(
        P.string('page'),
        this.space, this.equal, this.space,
        ['page', P.digits],
        P.all,
      ).parse(line);

    if (page.status) {
      this.currentPage = Number(page.value.page);
    } else if (this.currentPage) {
      const result = this.parseConstant(line);

      if (!this.result.constants.pages[this.currentPage]) {
        this.result.constants.pages[this.currentPage] = {
          number: this.currentPage,
          size: 0,
          data: {},
        };
      }

      let constant = {} as Constant;
      switch (result.type) {
        case 'scalar':
          constant = {
            type: result.type,
            size: result.size,
            offset: Number(result.offset),
            units: INI.sanitizeString(result.units),
            scale: INI.numberOrExpression(result.scale),
            transform: INI.numberOrExpression(result.transform),
            min: INI.numberOrExpression(result.min),
            max: INI.numberOrExpression(result.max),
            digits: Number(result.digits),
          };
          break;
        case 'array':
          constant = {
            type: result.type,
            size: result.size,
            offset: Number(result.offset),
            shape: INI.arrayShape(result.shape),
            units: INI.sanitizeString(result.units),
            scale: INI.numberOrExpression(result.scale),
            transform: INI.numberOrExpression(result.transform),
            min: INI.numberOrExpression(result.min),
            max: INI.numberOrExpression(result.max),
            digits: Number(result.digits),
          };
          break;
        case 'bits':
          constant = {
            type: result.type,
            size: result.size,
            offset: Number(result.offset),
            address: result.address.split(':').map(Number),
            values: (result.values || []).map(INI.sanitizeString),
          };
          break;
        default:
          break;
      }

      this.result.constants.pages[this.currentPage].data[result.name] = constant;
    }
  }

  private parseConstant(line: string) {
    const sqrBrackets: [P.Parser<any>, P.Parser<any>] = [P.string('['), P.string(']')];
    const address: any = [
      ['address', P.regexp(/\d+:\d+/).trim(this.space).wrap(...sqrBrackets)],
    ];

    // first common (eg. name = scalar, U08, 3,)
    const base: any = (type: string) => [
      ['name', P.regexp(/[0-9a-z_]*/i)],
      this.space, this.equal, this.space,
      ['type', P.string(type)],
      ...this.delimiter,
      ['size', this.size],
      ...this.delimiter,
      ['offset', P.digits],
    ];

    const scalarShortRest: any = [
      ['units', P.alt(
        this.expression,
        P.regexp(/[^"]*/).trim(this.space).wrap(this.quote, this.quote),
      )],
      ...this.delimiter,
      ['scale', P.alt(this.expression, this.numbers)],
      ...this.delimiter,
      ['transform', P.alt(this.expression, this.numbers)],
    ];

    const scalarRest: any = [
      ...scalarShortRest,
      ...this.delimiter,
      ['min', P.alt(this.expression, this.numbers)],
      ...this.delimiter,
      ['max', P.alt(this.expression, this.numbers)],
      ...this.delimiter,
      ['digits', P.digits],
      P.all,
    ];

    // normal scalar
    const scalar = P.seqObj<any>(
      ...base('scalar'),
      ...this.delimiter,
      ...scalarRest,
    );

    // short version of scalar (e.g. 'divider')
    const scalarShort = P.seqObj<any>(
      ...base('scalar'),
      ...this.delimiter,
      ...scalarShortRest,
    );

    // normal version of array
    const array = P.seqObj<any>(
      ...base('array'),
      ...this.delimiter,
      ['shape', P.regexp(/\d+\s*(x\s*\d+)*/).trim(this.space).wrap(...sqrBrackets)],
      ...this.delimiter,
      ...scalarRest,
    );

    // normal version of bits
    const bits = P.seqObj<any>(
      ...base('bits'),
      ...this.delimiter,
      ...address,
      ...this.delimiter,
      ['values', P.regexp(/[^,;]*/).trim(this.space).sepBy(this.comma)],
      P.all,
    );

    // short version of bits
    const bitsShort = P.seqObj<any>(
      ...base('bits'),
      ...this.delimiter,
      ...address,
      P.all,
    );

    return scalar
      .or(scalarShort)
      .or(array)
      .or(bits)
      .or(bitsShort)
      .tryParse(line);
  }

//   parseCurves(line: string) {
//     let match = line.match(this.CURVE_PATTERN);
//     if (match) {
//       this.currentCurve = match.groups!.name;
//       this.result.curves[this.currentCurve] = {
//         title: match.groups!.title,
//         labels: [],
//         xAxis: [],
//         yAxis: [],
//         xBins: [],
//         yBins: [],
//         size: [],
//       };
//     }

//     match = line.match(this.CURVE_LABELS_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].labels = match.groups!.labels
//         .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.CURVE_X_AXIS_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].xAxis = match.groups!.values
//         .split(',').map(Number);
//     }

//     match = line.match(this.CURVE_Y_AXIS_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].yAxis = match.groups!.values
//         .split(',').map(Number);
//     }

//     match = line.match(this.X_BINS_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].xBins = match.groups!.values
//         .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.Y_BINS_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].yBins = match.groups!.values
//       .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.CURVE_SIZE_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].size = match.groups!.values
//         .split(',').map(Number);
//     }

//     match = line.match(this.CURVE_GAUGE_PATTERN);
//     if (match) {
//       this.result.curves[this.currentCurve].gauge
//         = Parser.sanitizeString(match.groups!.value);
//     }
//   }

//   parseTables(line: string) {
//     let match = line.match(this.TABLE_PATTERN);
//     if (match) {
//       this.currentTable = match.groups!.name;
//       this.result.tables[this.currentTable] = {
//         name: match.groups!.name,
//         map: match.groups!.map,
//         title: Parser.sanitizeString(match.groups!.title),
//         page: Number(match.groups!.page),
//         help: '',
//         xBins: [],
//         yBins: [],
//         xyLabels: [],
//         zBins: [],
//         gridHeight: 0,
//         gridOrient: [],
//         upDownLabel: [],
//       };
//     }

//     match = line.match(this.HELP_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].help = Parser.sanitizeString(match.groups!.help);
//     }

//     match = line.match(this.X_BINS_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].xBins = match.groups!.values
//         .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.Y_BINS_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].yBins = match.groups!.values
//         .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.Z_BINS_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].zBins = match.groups!.values
//         .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.TABLE_LABELS_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].xyLabels = match.groups!.values
//         .split(',').map(Parser.sanitizeString);
//     }

//     match = line.match(this.TABLE_HEIGHT_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].gridHeight = Number(match.groups!.value);
//     }

//     match = line.match(this.TABLE_ORIENT_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].gridOrient = match.groups!.values
//         .split(',').map((val) => Number(val));
//     }

//     match = line.match(this.TABLE_UP_DW_LABELS_PATTERN);
//     if (match) {
//       this.result.tables[this.currentTable].upDownLabel = match.groups!.values
//         .split(',').map(Parser.sanitizeString);
//     }
//   }

//   parseOutputChannels(line: string) {
//     this.parseDefines(line);

//     const [name, rest] = line.split('=').map((part) => part.trim());

//     // not a constant - TODO: #if else
//     if (!rest) {
//       return;
//     }

//     const matchConstant = rest.match(this.OUTPUT_CHANNELS_FIRST_PATTERN);
//     // TODO: ochGetCommand    = "r\$tsCanId\x30%2o%2c"
//     if (!matchConstant || !matchConstant.groups) {
//       return;
//     }

//     // if / else
//     if (name in this.result.outputChannels) {
//       return;
//     }

//     let constant: Constant;
//     switch (matchConstant.groups.type) {
//       case ConstantTypes.SCALAR:
//         constant = Parser.parseScalar(rest, this.OUTPUT_CHANNELS_SCALAR_PATTERN);
//         break;
//       case ConstantTypes.BITS:
//         constant = this.parseBits(rest, this.OUTPUT_CHANNELS_BITS_PATTERN);
//         break;
//       default:
//         throw new Error(`Unsupported type: ${matchConstant.groups.type}`);
//     }

//     this.result.outputChannels[name] = constant;
//   }

//   parsePcVariables(line: string) {
//     this.parseDefines(line);

//     const [name, rest] = line.split('=').map((part) => part.trim());

//     // not a constant - TODO: #if else
//     if (!rest) {
//       return;
//     }

//     const matchConstant = rest.match(this.PC_VARIABLE_FIRST_PATTERN);
//     if (!matchConstant) {
//       return;
//     }

//     // TODO: handle this somehow
//     // TODO: LAMBDA:
//     // wueAFR = array, S16,  [10], "Lambda", { 0.1 / stoich }, 0.000, -0.300, 0.300, 3
//     // key already exists - IF ELSE most likely
//     // if (name in this.result.pcVariables) {
//     //   return;
//     // }

//     let constant;
//     switch (matchConstant.groups!.type) {
//       case 'scalar':
//         constant = Parser.parseScalar(rest, this.PC_VARIABLE_SCALAR_PATTERN);
//         break;
//       case 'array':
//         constant = Parser.parseArray(rest, this.PC_VARIABLE_ARRAY_PATTERN);
//         break;
//       case 'bits':
//         constant = this.parseBits(rest, this.PC_VARIABLE_BITS_PATTERN);
//         break;
//       default:
//         throw new Error(`Unsupported type: ${matchConstant.groups!.type}`);
//     }

//     this.result.pcVariables[name] = constant;
//   }

//   parseDefines(line: string) {
//     const match = line.match(this.DEFINE_PATTERN);
//     if (match) {
//       this.result.defines[match.groups!.key] = match.groups!.value.split(',')
//         .map(Parser.sanitizeString);

//       const resolved = this.result.defines[match.groups!.key].map((val) => (
//         val.startsWith('$')
//           ? this.result.defines[val.slice(1)]
//           : val
//         )).flat();

//       this.result.defines[match.groups!.key] = resolved;
//     }
//   }

//   parseKeyValue(section: string, line: string) {
//     const match = line.match(this.KEY_VALUE_PATTERN);
//     if (!match) {
//       return;
//     }

//     const sectionName = `${section.charAt(0).toLowerCase()}${section.slice(1)}`;
//     if (!this.result[sectionName]) {
//       // do not add section that are not explicitly defined
//       return;
//     }

//     this.result[sectionName][match.groups!.key] = Number.isNaN(Number(match.groups!.value))
//       ? match.groups!.value.trim()
//       : Number(match.groups!.value);
//   }

//   parseDialogs(line: string) {
//     let match = line.match(this.DIALOG_PATTERN);
//     if (match) {
//       this.currentDialog = match.groups!.name;
//       this.result.dialogs[this.currentDialog] = {
//         title: match.groups!.title,
//         layout: match.groups!.layout || '',
//         panels: {},
//         fields: [],
//         condition: '',
//       };

//       return;
//     }
//     match = line.match(this.HELP_PATTERN);
//     if (match) {
//       this.result.dialogs[this.currentDialog].help = Parser.sanitizeString(match.groups!.help);

//       return;
//     }

//     match = line.match(this.PANEL_PATTERN);
//     if (match) {
//       this.currentPanel = match.groups!.name;
//       this.result.dialogs[this.currentDialog].panels[this.currentPanel] = {
//         layout: match.groups!.layout || '',
//         condition: Parser.sanitizeCondition(match.groups!.condition || ''),
//       };

//       return;
//     }

//     // TODO:
//     // {
//     //   name: { egoType },
//     //   ...
//     // }
//     match = line.match(this.FIELD_PATTERN);
//     if (match) {
//       this.result.dialogs[this.currentDialog].fields.push({
//         name: match.groups!.name ? Parser.sanitizeString(match.groups!.name) : '_fieldText_',
//         title: Parser.sanitizeString(match.groups!.title),
//         condition: Parser.sanitizeCondition(match.groups!.condition || ''),
//       });
//     }
//   }

//   parseConstants(line: string) {
//     this.parseDefines(line);

//     const pageMatch = line.match(this.PAGE_PATTERN);
//     if (pageMatch) {
//       this.currentPage = Number(pageMatch.groups!.page);
//       this.result.constants.pages[this.currentPage - 1] = {
//         number: this.currentPage,
//         size: 111,
//         data: {},
//       };

//       return;
//     }

//     const [name, rest] = line.split('=').map((part) => part.trim());

//     // not a constant - TODO: #if else
//     if (!rest) {
//       return;
//     }

//     const match = rest.match(this.CONSTANT_FIRST_PATTERN);
//     if (!match) {
//       return;
//     }

//     // TODO: handle this somehow
//     // key already exists - IF ELSE most likely
//     if (name in this.result.constants.pages[this.currentPage - 1].data) {
//       return;
//     }

//     let constant;
//     switch (match.groups!.type) {
//       case ConstantTypes.SCALAR:
//         constant = Parser.parseScalar(rest, this.CONSTANT_SCALAR_PATTERN);
//         break;
//       case ConstantTypes.ARRAY:
//         constant = Parser.parseArray(rest, this.CONSTANT_ARRAY_PATTERN);
//         break;
//       case ConstantTypes.BITS:
//         // TODO: handle this case
//         if (name === 'unused_fan_bits') {
//           return;
//         }
//         constant = this.parseBits(rest, this.CONSTANT_BITS_PATTERN);
//         break;

//       default:
//         throw new Error(`Unsupported type: ${match.groups!.type}`);
//     }

//     this.result.constants.pages[this.currentPage - 1].data[name] = constant;
//   }

//   parseMenu(line: string) {
//     const menuMatch = line.match(this.MENU_PATTERN);
//     if (menuMatch) {
//       const title = menuMatch.groups!.menu.replace(/&/g, '');
//       const name = title
//         .toLowerCase()
//         .replace(/([^\w]\w)/g, (g) => g[1].toUpperCase()); // camelCase

//       this.currentMenu = name;

//       this.result.menus[this.currentMenu] = {
//         title,
//         subMenus: {},
//       };

//       return;
//     }

//     const subMenuMatch = line.match(this.SUB_MENU_PATTERN);
//     if (subMenuMatch) {
//       this.result.menus[this.currentMenu].subMenus[subMenuMatch.groups!.name] = {
//         title: subMenuMatch.groups!.title,
//         page: Number(subMenuMatch.groups!.page || 0),
//         condition: Parser.sanitizeCondition(subMenuMatch.groups!.condition || ''),
//       };
//     }
//   }

//   parseBits(input: string, pattern: RegExp): BitsConstantType {
//     const match = input.match(pattern);
//     if (!match) {
//       throw new Error(`Unable to parse bits: ${input}`);
//     }

//     let values = match.groups!.values
//       ? match.groups!.values
//         .split(',')
//         .map((val: string) => val.replace(/"/g, '').trim())
//       : [];

//     values = values.map((val: string) => (
//       val.startsWith('$')
//         ? this.result.defines[val.slice(1)]
//         : val
//     )).flat();

//     return {
//       type: ConstantTypes.BITS,
//       size: match.groups!.size as ConstantSizeType,
//       offset: Number(match.groups!.offset || 0),
//       address: {
//         from: Number(match.groups!.from),
//         to: Number(match.groups!.to),
//       },
//       values,
//     };
//   }

//   static parseScalar(input: string, pattern: RegExp): ScalarConstantType {
//     const match = input.match(pattern);
//     if (!match) {
//       // throw new Error(`Unable to parse scalar: ${input}`);
//       return {} as ScalarConstantType;
//     }

//     return {
//       type: ConstantTypes.SCALAR,
//       size: match.groups!.size as ConstantSizeType,
//       offset: Number(match.groups!.offset || 0),
//       units: Parser.sanitizeString(match.groups!.units),
//       scale: Number(match.groups!.scale),
//       transform: Number(match.groups!.transform),
//       min: Number(match.groups!.min) || 0,
//       max: Number(match.groups!.max) || 0,
//       digits: Number(match.groups!.digits) || 0,
//     };
//   }

//   static parseArray(input: string, pattern: RegExp): ArrayConstantType {
//     const match = input.match(pattern);
//     if (!match) {
//       // throw new Error(`Unable to parse array: ${input}`);
//       return {} as ArrayConstantType;
//     }
//     const [columns, rows] = match.groups!.shape
//       .split('x')
//       .map((val: string) => val.trim());

//     return {
//       type: ConstantTypes.ARRAY,
//       size: match.groups!.size as ConstantSizeType,
//       offset: Number(match.groups!.offset || 0),
//       shape: {
//         columns: Number(columns),
//         rows: Number(rows || 0),
//       },
//       units: Parser.sanitizeString(match.groups!.units),
//       scale: Number(match.groups!.scale),
//       transform: Number(match.groups!.transform),
//       min: Number(match.groups!.min),
//       max: Number(match.groups!.max),
//       digits: Number(match.groups!.digits),
//     };
//   }

//   static sanitizeComments = (val: string) => (val || '').replace(';', '').trim();

  private static numberOrExpression = (val: string | undefined | null) => INI.isNumber(val || '0') ? Number(val || 0) : INI.sanitizeString(`${val}`);

  private static sanitizeString = (val: string) => val.replace(/"/g, '').trim();

  private static isNumber = (val: string) => !Number.isNaN(Number(val));

  private static arrayShape = (val: string) => {
    const parts = INI.sanitizeString(val).split('x');
    return {
      columns: Number(parts[0]),
      rows: parts[1] ? Number(parts[1]) : 0,
    };
  };

//   static stripComments = (val: string) => val.replace(/(\s*;.+$)/, '');

//   static sanitizeCondition = (val: string) => val.replace(/^{\s*|\s*}$/g, '').trim();
}

const versions = [
  202012,
  202103,
];

// versions.forEach((version) => {
//   const result = new Parser(
//     fs.readFileSync(path.join(__dirname, `/../../public/tunes/${version}.ini`), 'utf8'),
//   ).parse();

//   fs.writeFileSync(path.join(__dirname, `/../../public/tunes/${version}.yml`), yaml.dump(result));
//   fs.writeFileSync(path.join(__dirname, `/../../public/tunes/${version}.json`), JSON.stringify(result));
// });

const result = new INI(
  fs.readFileSync(path.join(__dirname, `/../../public/tunes/${versions[1]}.ini`), 'utf8'),
).parse();

console.dir(
  result,
  { depth: null, compact: false },
);

console.log('------- end --------');
