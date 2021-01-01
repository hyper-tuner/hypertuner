/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('------- start --------');

class Parser {
  constructor(buffer) {
    this.COMMENTS_PATTERN = '\\s*(?<comments>;.+)*';
    this.BASE_PATTERN = '^(?<type>scalar|bits|array),\\s*(?<size>[A-Z\\d]+),\\s*(?<offset>\\d+)';
    this.SCALAR_BASE_PATTERN = `\\s*"(?<units>.*)",*\\s*(?<scale>[\\-\\d.]+),\\s*(?<transform>[\\-\\d.]+),\\s*(?<min>[\\-\\d.]+),\\s*(?<max>[\\-\\d.]+),\\s*(?<digits>[\\d.]+)`;
    this.FIRST_PATTERN  = new RegExp(`${this.BASE_PATTERN}.+`);
    this.SCALAR_PATTERN = new RegExp(`${this.BASE_PATTERN},${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);
    this.BITS_PATTERN = new RegExp(`${this.BASE_PATTERN},\\s*\\[(?<from>\\d+):(?<to>\\d+)\\],\\s*(?<values>.+?)${this.COMMENTS_PATTERN}$`);
    this.ARRAY_PATTERN = new RegExp(`${this.BASE_PATTERN},\\s*\\[(?<shape>.+)\\],*${this.SCALAR_BASE_PATTERN}${this.COMMENTS_PATTERN}$`);

    this.SECTION_HEADER_PATTERN = /^\[(?<section>[A-z]+)]$/;

    this.lines = buffer.toString().split('\n');
    this.currentPage = 1;
    this.currentDialog = {};
    this.currentPanel = {};

    this.result = {
      constants: {
        pages: [],
      },
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
        section = matches.groups.section;
      } else if (section) {
        this.parseLine(section, trimmed);
      }
    });
  }

  parseLine(section, line) {
    switch (section) {
      // case 'Constants':
      //   this.parseConstants(line);
      //   break;
      case 'UserDefined':
        this.parseUserDefined(line);
        break;
      default:
        break;
    }
  }

  parseUserDefined(line) {
    const matchDialog = line.match(/^dialog\s*=\s*(?<name>\w+),\s*"(?<title>.*)",*\s*(?<layout>xAxis|yAxis|border)*/);
    if (matchDialog) {
      this.currentDialog = matchDialog.groups.name;
      this.result.dialogs[this.currentDialog] = {
        name: this.currentDialog,
        title: matchDialog.groups.title,
        layout: matchDialog.groups.layout || '',
        panels: {},
        fields: [],
      };

      return;
    }

    const matchPanel = line.match(/^panel\s*=\s*(?<name>\w+),\s*(?<layout>\w+|{})*,*\s*({(?<condition>.+)})*/);
    if (matchPanel) {
      this.currentPanel = matchPanel.groups.name;
      this.result.dialogs[this.currentDialog].panels[this.currentPanel] = {
        name: this.currentPanel,
        layout: matchPanel.groups.layout || '',
        condition: (matchPanel.groups.condition || '').trim(),
      };

      return;
    }

    const matchField = line.match(/^field\s*=\s*(?<field>.+)/);
    if (matchField) {
      const [title, name, condition] = matchField.groups.field.split(',');

      this.result.dialogs[this.currentDialog].fields.push({
        name: name ? name.trim() : 'divider',
        // TODO: remove this: "Low (E0) "'
        title: title.trim(),
        condition: (condition || '').trim().replace(/^{\s*|\s*}$/g, ''),
      });
    }
  }

  parseConstants(line) {
    let constant;

    const pageMatch = line.match(/^page\s*=\s*(?<page>\d+)/);
    if (pageMatch) {
      this.currentPage = Number(pageMatch.groups.page);
      this.result.constants.pages[this.currentPage - 1] = {
        number: this.currentPage,
        size: 111,
        data: {},
      };
    }

    const [name, rest] = line.split('=').map((part) => part.trim());

    // not a constant - TODO: #if else
    if (!rest) {
      return;
    }

    const match = rest.match(this.FIRST_PATTERN);
    if (!match) {
      return;
    }

    // TODO: handle this
    // not an actual constant
    if (name === 'divider') {
      return;
    }

    // TODO: handle this somehow
    // key already exists - IF ELSE most likely
    if (name in this.result.constants.pages[this.currentPage - 1].data) {
      return;
    }

    switch (match.groups.type) {
      case 'scalar':
        constant = this.parseScalar(rest);
        break;
      case 'array':
        constant = this.parseArray(rest);
        break;
      case 'bits':
        // TODO: handle this case
        if (name === 'unused_fan_bits') {
          return;
        }
        constant = this.parseBits(rest);
        break;

      default:
        throw new Error(`Unsupported type: ${match.groups.type}`);
    }

    this.result.constants.pages[this.currentPage - 1].data[name] = constant;
  }

  parseScalar(input) {
    const match = input.match(this.SCALAR_PATTERN);
    if (!match) {
      throw new Error(`Unable to parse line: ${input}`);
    }

    return {
      type: match.groups.type,
      size: match.groups.size,
      offset: Number(match.groups.offset),
      units: match.groups.units,
      scale: Number(match.groups.scale),
      transform: Number(match.groups.transform),
      min: Number(match.groups.min),
      max: Number(match.groups.max),
      digits: Number(match.groups.digits),
      comments: Parser.sanitizeComments(match.groups.comments),
    };
  }

  parseArray(input) {
    const match = input.match(this.ARRAY_PATTERN);
    if (!match) {
      throw new Error(`Unable to parse line: ${input}`);
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
      comments: Parser.sanitizeComments(match.groups.comments),
    };
  }

  parseBits(input) {
    const match = input.match(this.BITS_PATTERN);

    if (!match) {
      throw new Error(`Unable to parse line: ${input}`);
    }

    return {
      type: match.groups.type,
      size: match.groups.size,
      offset: Number(match.groups.offset),
      address: {
        from: Number(match.groups.from),
        to: Number(match.groups.to),
      },
      values: match.groups.values.split(',').map((val) => val.replace(/"/g, '').trim()),
      comments: Parser.sanitizeComments(match.groups.comments),
    };
  }

  static sanitizeComments = (val) => (val || '').replace(';', '').trim();
}

const result = new Parser(
  fs.readFileSync(path.join(__dirname, '/constants.ini'), 'utf8')
).parse();

// console.dir(result.constants.pages[1], { maxArrayLength: 1000, depth: null });
// console.dir(result.dialogs, { maxArrayLength: 10, depth: null });
// console.dir(yaml.dump(result), { maxArrayLength: 1000, depth: null });
// console.dir(yaml.dump({ asd: 123, 'sd-asd': 22 }), { maxArrayLength: 1000, depth: null });

fs.writeFileSync(path.join(__dirname, '/generated.yml'), yaml.dump(result));

// console.log(yaml.safeDump(result.dialogs));

console.log('------- end --------');
