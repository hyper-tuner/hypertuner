/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

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

    this.lines = buffer.toString().split('\n');
    this.pages = [];
  }

  parse() {
    try {
      this.parsePages();
    } catch (error) {
      if (error.message !== 'EOP') {
        throw error;
      }
    }

    return this.pages;
  }

  parsePages() {
    const constants = {};

    this.pages[0] = {
      number: 1,
      size: 128,
      constants: {},
    };

    this.lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith(';')) {
        return;
      }

      if (trimmed === '[EventTriggers]') {
        throw new Error('EOP');
      }

      const pair = trimmed.split('=').map((part) => part.trim());
      const [name, rest] = pair;

      // 'key = value' pair but probably not a constant
      if (!rest) {
        return;
      }

      const match = rest.match(this.FIRST_PATTERN);
      if (!match) {
        return;
      }

      // not an actual constant
      if (name === 'divider') {
        return;
      }

      // TODO: handle this somehow
      // key already exists - IF ELSE most likely
      if (name in constants) {
        return;
      }

      switch (match.groups.type) {
        case 'scalar':
          constants[name] = this.parseScalar(rest);
          break;
        case 'array':
          constants[name] = this.parseArray(rest);
          break;
        case 'bits':
          // TODO: handle this case
          if (name === 'unused_fan_bits') {
            return;
          }
          constants[name] = this.parseBits(rest);
          break;

        default:
          throw new Error(`Unsupported type: ${match.groups.type}`);
      }

      this.pages[0].constants = {
        ...this.pages[0].constants,
        constants,
      };
    });
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
  fs.readFileSync(path.join(__dirname, '/constants.ini'))
).parse();

console.dir(result[0].constants, { maxArrayLength: 10, depth: null });

console.log('------- end --------');
