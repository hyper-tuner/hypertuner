/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('------- start --------');

class Parser {
  constructor(buffer) {
    this.COMMENTS_PATTERN = '\\s*(?<comments>;.+)*';
    this.CONDITION_PATTERN = '\\s*,*\\s*(?<condition>{.+?}?)*';

    this.DIALOG_PATTERN = new RegExp(`^dialog\\s*=\\s*(?<name>\\w+),\\s*"(?<title>.*)",*\\s*(?<layout>.+)*${this.COMMENTS_PATTERN}$`);
    this.PANEL_PATTERN = new RegExp(`^panel\\s*=\\s*(?<name>\\w+),\\s*(?<layout>\\w+|{})*,*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.FIELD_PATTERN = new RegExp(`^field\\s*=\\s*"(?<title>.*)"\\s*,*\\s*(?<name>[\\w[\\]]+)*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.FIELD_TEXT_PATTERN = new RegExp(`^field\\s*=\\s*"(?<title>.*)"${this.COMMENTS_PATTERN}$`);
    this.PAGE_PATTERN = new RegExp(`^page\\s*=\\s*(?<page>\\d+)${this.COMMENTS_PATTERN}$`);

    this.CONSTANT_BASE_PATTERN = '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*\\s*(?<offset>\\d+)';
    this.PC_VARIABLE_BASE_PATTERN = '^(?<type>scalar|bits|array)\\s*,*\\s*(?<size>[A-Z\\d]+)\\s*,*';
    this.SCALAR_BASE_PATTERN = '\\s*"(?<units>.*)",*\\s*(?<scale>[\\-\\d.]+),\\s*(?<transform>[\\-\\d.]+),*\\s*(?<min>[\\-\\d.]+)*,*\\s*(?<max>[\\-\\d.]+)*,*\\s*(?<digits>[\\d.]+)*';

    this.CONSTANT_FIRST_PATTERN  = new RegExp(`${this.CONSTANT_BASE_PATTERN}.+`);
    this.CONSTANT_SCALAR_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.CONSTANT_BITS_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\],\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
    this.CONSTANT_ARRAY_PATTERN = new RegExp(`${this.CONSTANT_BASE_PATTERN},\\s*\\[(?<shape>.+)\\],*${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.PC_VARIABLE_FIRST_PATTERN  = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN}.+`);
    this.PC_VARIABLE_SCALAR_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN},${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.PC_VARIABLE_BITS_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\],\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
    this.PC_VARIABLE_ARRAY_PATTERN = new RegExp(`${this.PC_VARIABLE_BASE_PATTERN},\\s*\\[(?<shape>.+)\\],*${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.SECTION_HEADER_PATTERN = new RegExp(`^\\[(?<section>[A-z]+)]${this.COMMENTS_PATTERN}$`);
    this.KEY_VALUE_PATTERN = new RegExp(`^(?<key>\\w+)\\s*=\\s*"*(?<value>.+?)"*${this.COMMENTS_PATTERN}$`);

    this.DEFINE_PATTERN = new RegExp(`^#\\s*define\\s*(?<key>\\w+)\\s*=\\s*"*(?<value>.+?)"*${this.COMMENTS_PATTERN}$`);

    this.MENU_PATTERN = new RegExp(`^menu\\s*=\\s*"(?<menu>.+)"${this.COMMENTS_PATTERN}$`);
    this.SUB_MENU_PATTERN = new RegExp(`^subMenu\\s*=\\s*(?<name>\\w+),\\s+"(?<title>.+)",*\\s*(?<page>\\d+)*\\s*,*${this.CONDITION_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.lines = buffer.toString().split('\n');
    this.currentPage = 1;
    this.currentDialog = {};
    this.currentPanel = {};
    this.currentMenu = null;

    this.result = {
      megaTune: {},
      tunerStudio: {},
      defines: {},
      pcVariables: {},
      constants: {
        pages: [],
      },
      menus: {},
      dialogs: {},
    };
  }

  parse() {
    this.parseSections();

    return this.result;
  }

  parseSections() {
    let section;

    this.lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith(';')) {
        return;
      }

      const matches = trimmed.match(this.SECTION_HEADER_PATTERN);
      if (matches) {
        // console.log('Found section:', matches.groups.section);
        section = matches.groups.section;
      } else if (section) {
        this.parseSectionLine(section, trimmed);
      }
    });
  }

  parseSectionLine(section, line) {
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
      case 'UserDefined':
        this.parseDialogs(line);
        break;
      default:
        this.parseKeyValue(section, line);
        break;
    }
  }

  parsePcVariables(line) {
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
    switch (matchConstant.groups.type) {
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
        throw new Error(`Unsupported type: ${matchConstant.groups.type}`);
    }

    this.result.pcVariables[name] = constant;
  }

  parseDefines(line) {
    const match = line.match(this.DEFINE_PATTERN);
    if (match) {
      this.result.defines[match.groups.key] = match.groups.value.split(',')
        .map((val) => Parser.sanitizeString(val));
    }
  }

  parseKeyValue(section, line) {
    const match = line.match(this.KEY_VALUE_PATTERN);
    if (!match) {
      return;
    }

    const sectionName = `${section.charAt(0).toLowerCase()}${section.slice(1)}`;
    if (!this.result[sectionName]) {
      // do not add section that are not explicitly defined
      return;
    }

    this.result[sectionName][match.groups.key] = Number.isNaN(Number(match.groups.value))
      ? match.groups.value
      : Number(match.groups.value);
  }

  parseDialogs(line) {
    const matchDialog = line.match(this.DIALOG_PATTERN);
    if (matchDialog) {
      this.currentDialog = matchDialog.groups.name;
      this.result.dialogs[this.currentDialog] = {
        title: matchDialog.groups.title,
        layout: matchDialog.groups.layout || '',
        panels: {},
        fields: [],
      };

      return;
    }

    const matchPanel = line.match(this.PANEL_PATTERN);
    if (matchPanel) {
      this.currentPanel = matchPanel.groups.name;
      this.result.dialogs[this.currentDialog].panels[this.currentPanel] = {
        layout: matchPanel.groups.layout || '',
        condition: Parser.sanitizeCondition(matchPanel.groups.condition || ''),
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
        name: matchField.groups.name ? Parser.sanitizeString(matchField.groups.name) : '_fieldText_',
        title: Parser.sanitizeString(matchField.groups.title),
        condition: Parser.sanitizeCondition(matchField.groups.condition || ''),
      });
    }
  }

  parseConstants(line) {
    this.parseDefines(line);

    const pageMatch = line.match(this.PAGE_PATTERN);
    if (pageMatch) {
      this.currentPage = Number(pageMatch.groups.page);
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
    switch (match.groups.type) {
      case 'scalar':
        constant = Parser.parseScalar(rest, this.CONSTANT_SCALAR_PATTERN);
        break;
      case 'array':
        constant = Parser.parseArray(rest, this.CONSTANT_ARRAY_PATTERN);
        break;
      case 'bits':
        // TODO: handle this case
        if (name === 'unused_fan_bits') {
          return;
        }
        constant = this.parseBits(rest, this.CONSTANT_BITS_PATTERN);
        break;

      default:
        throw new Error(`Unsupported type: ${match.groups.type}`);
    }

    this.result.constants.pages[this.currentPage - 1].data[name] = constant;
  }

  parseMenu(line) {
    const menuMatch = line.match(this.MENU_PATTERN);
    if (menuMatch) {
      const title = menuMatch.groups.menu.replace(/&/g, '');
      const name = title
        .toLowerCase()
        .replace(/([^\w]\w)/g, (g) => g[1].toUpperCase()); // camelCase

      this.currentMenu = name;

      this.result.menus[this.currentMenu] = {
        title,
        subMenus: {}
      };

      return;
    }

    const subMenuMatch = line.match(this.SUB_MENU_PATTERN);
    if (subMenuMatch) {
      this.result.menus[this.currentMenu].subMenus[subMenuMatch.groups.name] = {
        title: subMenuMatch.groups.title,
        page: Number(subMenuMatch.groups.page || 0),
        condition: Parser.sanitizeCondition(subMenuMatch.groups.condition || ''),
      };
    }
  }

  parseBits(input, pattern) {
    const match = input.match(pattern);
    if (!match) {
      throw new Error(`Unable to parse bits: ${input}`);
    }

    let values = match.groups.values
      .split(',')
      .map((val) => val.replace(/"/g, '').trim());

    // wmiIndicatorPin      = bits,   U08,     156, [1:6], "Board Default", $DIGITAL_PIN

    if (values.find((val) => val.startsWith('$'))) {
      const resolved = this.result.defines[values[0].slice(1)];
      // console.log(values, resolved);
      // console.log(values, input);

      // TODO: may be array
      if (resolved) {
        values = resolved;
      }
      // console.log(values, values[0].slice(1));
    }

    return {
      type: match.groups.type,
      size: match.groups.size,
      offset: Number(match.groups.offset),
      address: {
        from: Number(match.groups.from),
        to: Number(match.groups.to),
      },
      values,
    };
  }

  static parseScalar(input, pattern) {
    const match = input.match(pattern);
    if (!match) {
      // throw new Error(`Unable to parse scalar: ${input}`);
      return {};
    }

    return {
      type: match.groups.type,
      size: match.groups.size,
      offset: Number(match.groups.offset),
      units: match.groups.units,
      scale: Number(match.groups.scale),
      transform: Number(match.groups.transform),
      min: Number(match.groups.min) || 0,
      max: Number(match.groups.max) || 0,
      digits: Number(match.groups.digits) || 0,
    };
  }

  static parseArray(input, pattern) {
    const match = input.match(pattern);
    if (!match) {
      // throw new Error(`Unable to parse array: ${input}`);
      return {};
    }
    const [columns, rows] = match.groups.shape
      .split('x')
      .map((val) => val.trim());

    return {
      type: match.groups.type,
      size: match.groups.size,
      offset: Number(match.groups.offset),
      shape: {
        columns: Number(columns),
        rows: Number(rows || 0),
      },
      units: match.groups.units,
      scale: Number(match.groups.scale),
      transform: Number(match.groups.transform),
      min: Number(match.groups.min),
      max: Number(match.groups.max),
      digits: Number(match.groups.digits),
    };
  }

  static sanitizeComments = (val) => (val || '').replace(';', '').trim();

  static sanitizeString = (val) => val.replace(/"/g, '').trim();

  static stripComments = (val) => val.replace(/(\s*;.+$)/, '');

  static sanitizeCondition = (val) => val.replace(/^{\s*|\s*}$/g, '').trim();
}

const result = new Parser(
  fs.readFileSync(path.join(__dirname, '/../public/tunes/speeduino.ini'), 'utf8')
).parse();

// console.dir(result.defines, { maxArrayLength: 10, depth: null });

fs.writeFileSync(path.join(__dirname, '/../public/tunes/speeduino.yml'), yaml.dump(result));

console.log('------- end --------');
