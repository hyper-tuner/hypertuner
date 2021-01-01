/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

console.log('------- start --------');

class Parser {

  // const args = process.argv.slice(2);

  // const showUsage = () => {
  //   process.exit(1);
  // };

  constructor(buffer) {
    this.BASE_PATTERN = '^(?<type>scalar|bits|array),\\s*(?<size>[A-Z\\d]+),\\s*(?<offset>\\d+)';
    this.SCALAR_BASE_PATTERN = `\\s*"(?<units>.+)",\\s*(?<scale>[\\-\\d.]+),\\s*(?<transform>[\\-\\d.]+),\\s*(?<min>[\\-\\d.]+),\\s*(?<max>[\\-\\d.]+),\\s*(?<unknown>[\\d.]+)`;
    this.FIRST_PATTERN  = new RegExp(`${this.BASE_PATTERN}.+`);
    this.SCALAR_PATTERN = new RegExp(
      `${this.BASE_PATTERN},${this.SCALAR_BASE_PATTERN}$`
    );
    this.BITS_PATTERN = new RegExp(
      `${this.BASE_PATTERN},\\s*\\[(?<from>\\d):(?<to>\\d)\\],\\s*(?<values>.+)`
    );
    this.ARRAY_PATTERN = new RegExp(
      `${this.BASE_PATTERN},\\s*(?<shape>.+),${this.SCALAR_BASE_PATTERN}$`
    );

    this.lines = buffer.toString().split('\n');
    this.page = {
      number: 1,
      size: 128,
      constants: {},
    };
  }

  parse() {
    this.lines.forEach((line) => {
      const pair = line.split('=')
        .map((part) => part.trim());

      const [name, rest] = pair;

      // end of file
      if (!rest) {
        return;
      }

      const match = rest.match(this.FIRST_PATTERN);
      if (!match) {
        return;
      }

      // TODO: handle this somehow?
      // key already exists - IF ELSE most likely
      if (name in this.page.constants) {
        return;
      }

      this.page.constants[name] = {
        type: match.groups.type,
        size: match.groups.size,
        offset: Number(match.groups.offset),
      };

      switch (match.groups.type) {
        case 'scalar':
          this.parseScalar(name, rest);
          break;
        case 'array':
          this.parseArray(name, rest);
          break;
        case 'bits':
          this.parseBits(name, rest);
          break;

        default:
          throw new Error(`Unsupported type: ${match.groups.type}`);
      }
    });

    return this.page;
  }

  parseScalar(name, input) {
    const match = input.match(this.SCALAR_PATTERN);
    if (!match) {
      throw new Error(`Unable to parse [${name}]: ${input}`);
    }

    this.page.constants[name] = {
      ...this.page.constants[name],
      units: match.groups.units,
      scale: Number(match.groups.scale),
      transform: Number(match.groups.transform),
      min: Number(match.groups.min),
      max: Number(match.groups.max),
      unknown: Number(match.groups.unknown),
    };
  }

  parseArray(name, input) {
    const match = input.match(this.ARRAY_PATTERN);
    if (!match) {
      throw new Error(`Unable to parse [${name}]: ${input}`);
    }

    this.page.constants[name] = {
      ...this.page.constants[name],
      shape: match.groups.shape, // TODO: shape
      units: match.groups.units,
      scale: Number(match.groups.scale),
      transform: Number(match.groups.transform),
      min: Number(match.groups.min),
      max: Number(match.groups.max),
      unknown: Number(match.groups.unknown),
    };
  }

  parseBits(name, input) {
    const match = input.match(this.BITS_PATTERN);
    if (!match) {
      throw new Error(`Unable to parse [${name}]: ${input}`);
    }

    this.page.constants[name] = {
      ...this.page.constants[name],
      address: {
        from: Number(match.groups.from),
        to: Number(match.groups.to),
      },
      values: match.groups.values.split(',').map((val) => val.replace(/"/g, '').trim()),
    };
  }
}

const result = new Parser(
  fs.readFileSync(path.join(__dirname, '/constants.ini'))
).parse();

console.dir(result.constants, { maxArrayLength: 10 });

console.log('------- end --------');
