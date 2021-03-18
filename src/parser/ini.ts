import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import * as P from 'parsimmon';

import {
  Config as ConfigType,
  Constant,
} from '../types/config';

console.log('------- start --------');

class INI {
  space: P.Parser<any>;

  expression: P.Parser<any>;

  numbers: P.Parser<any>;

  name: P.Parser<any>;

  equal: P.Parser<any>;

  quote: P.Parser<any>;

  quotes: [P.Parser<any>, P.Parser<any>];

  comma: P.Parser<any>;

  size: P.Parser<any>;

  delimiter: [P.Parser<any>, P.Parser<any>, P.Parser<any>];

  notQuote: P.Parser<any>;

  sqrBrackets: [P.Parser<any>, P.Parser<any>];

  inQuotes: P.Parser<any>;

  values: P.Parser<any>;

  lines: string[];

  currentPage?: number;

  currentDialog?: string;

  currentPanel?: string;

  currentMenu?: string;

  currentCurve?: string;

  currentTable?: string;

  result: ConfigType;

  constructor(buffer: string) {
    this.space = P.optWhitespace;
    this.expression = P.regexp(/{.+?}/);
    this.numbers = P.regexp(/[0-9.-]*/);
    this.name = P.regexp(/[0-9a-z_]*/i);
    this.equal = P.string('=');
    this.quote = P.string('"');
    this.quotes = [this.quote, this.quote];
    this.comma = P.string(',');
    this.size = P.regexp(/U08|S08|U16|S16|U32|S32|S64|F32|ASCII/);
    this.delimiter = [this.space, this.comma, this.space];
    this.notQuote = P.regexp(/[^"]*/);
    this.sqrBrackets = [P.string('['), P.string(']')];
    this.inQuotes = this.notQuote.trim(this.space).wrap(...this.quotes);
    this.values = P.regexp(/[^,;]*/).trim(this.space).sepBy(this.comma);

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
        MTversion: 0,
        queryCommand: '',
        versionInfo: '',
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

  private parseSections() {
    let section: string;

    this.lines.forEach((raw) => {
      const line = raw.trim();
      // skip empty lines and lines with comments only
      // skip #if for now
      if (line === '' || line.startsWith(';') || (line.startsWith('#') && !line.startsWith('#define'))) {
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
        return;
      }

      if (section) {
        this.parseSectionLine(section, line);
      }
    });
  }

  private parseSectionLine(section: string, line: string) {
    switch (section) {
      case 'MegaTune':
        this.parseKeyValueFor('megaTune', line);
        break;
      case 'TunerStudio':
        this.parseKeyValueFor('tunerStudio', line);
        break;
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
        this.parseKeyValueFor('help', line);
        break;
      case 'UserDefined':
        this.parseDialogs(line);
        break;
      case 'CurveEditor':
        this.parseCurves(line);
        break;
      case 'TableEditor':
        this.parseTables(line);
        break;
      case 'OutputChannels':
        this.parseOutputChannels(line);
        break;
      default:
        break;
    }
  }

  private parseOutputChannels(line: string) {
    try {
      const result = this.parseConstAndVar(line);

      this.result.outputChannels[result.name] = {
        type: result.type,
        size: result.size,
        offset: Number(result.offset),
        units: INI.sanitize(result.units),
        scale: INI.isNumber(result.scale) ? Number(result.scale) : INI.sanitize(result.scale),
        transform: INI.isNumber(result.transform) ? Number(result.transform) : INI.sanitize(result.transform),
      };
      return;
    } catch (_) {
      const base: any = [
        ['name', this.name],
        this.space, this.equal, this.space,
      ];

      // TODO: throttle   = { tps }, "%"
      // ochGetCommand    = "r\$tsCanId\x30%2o%2c"
      // ochBlockSize     =  117
      // coolant          = { coolantRaw - 40 }
      const result = P
        .seqObj<any>(
          ...base,
          ['value', this.notQuote.wrap(...this.quotes)],
          P.all,
        )
        .or(P.seqObj<any>(
          ...base,
          ['value', this.expression],
          P.all,
        ))
        .or(P.seqObj<any>(
          ...base,
          ['value', this.numbers],
          P.all,
        ))
        .tryParse(line);

      this.result.outputChannels[result.name] = {
        value: INI.sanitize(result.value),
      };
    }
  }

  private parseTables(line: string) {
    // table = veTable1Tbl,  veTable1Map, "VE Table", 2
    const tableResult = P.seqObj<any>(
      P.string('table'),
      this.space, this.equal, this.space,
      ['name', this.name],
      ...this.delimiter,
      ['map', this.name],
      ...this.delimiter,
      ['title', this.inQuotes],
      ...this.delimiter,
      ['page', P.digits],
      P.all,
    ).parse(line);

    if (tableResult.status) {
      this.currentTable = tableResult.value.name;
      this.result.tables[this.currentTable!] = {
        map: tableResult.value.map,
        title: INI.sanitize(tableResult.value.title),
        page: Number(tableResult.value.page),
        xBins: [],
        yBins: [],
        xyLabels: [],
        zBins: [],
        gridHeight: 0,
        gridOrient: [],
        upDownLabel: [],
      };

      return;
    }

    // topicHelp = "http://speeduino.com/wiki/index.php/Tuning"
    const helpResult = P.seqObj<any>(
      P.string('topicHelp'),
      this.space, this.equal, this.space,
      ['help', this.inQuotes],
      P.all,
    ).parse(line);

    if (helpResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].help = INI.sanitize(helpResult.value.help);

      return;
    }

    // xBins       = rpmBins,  rpm
    // yBins       = fuelLoadBins, fuelLoad
    // xyLabels    = "RPM", "Fuel Load: "
    // zBins       = veTable
    // gridOrient  = 250,   0, 340
    // upDownLabel = "(RICHER)", "(LEANER)"
    const parseBins = (name: string) => P.seqObj<any>(
      P.string(name),
      this.space, this.equal, this.space,
      ['values', this.values],
      P.all,
    ).parse(line);

    const xBinsResult = parseBins('xBins');
    if (xBinsResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].xBins = xBinsResult
        .value
        .values
        .map(INI.sanitize);

      return;
    }

    const yBinsResult = parseBins('yBins');
    if (yBinsResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].yBins = yBinsResult
        .value
        .values
        .map(INI.sanitize);

      return;
    }

    const yxLabelsResult = parseBins('xyLabels');
    if (yxLabelsResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].xyLabels = yxLabelsResult
        .value
        .values
        .map(INI.sanitize);

      return;
    }

    const zBinsResult = parseBins('zBins');
    if (zBinsResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].zBins = zBinsResult
        .value
        .values
        .map(INI.sanitize);

      return;
    }

    // gridHeight  = 2.0
    const gridHeightResult = P.seqObj<any>(
      P.string('gridHeight'),
      this.space, this.equal, this.space,
      ['gridHeight', this.numbers],
      P.all,
    ).parse(line);

    if (gridHeightResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].gridHeight = Number(gridHeightResult.value.gridHeight);

      return;
    }

    const gridOrientResult = parseBins('gridOrient');
    if (gridOrientResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].gridOrient = gridOrientResult
        .value
        .values
        .map(Number);

      return;
    }

    const upDownResult = parseBins('upDownLabel');
    if (upDownResult.status) {
      if (!this.currentTable) {
        throw new Error('Table not set');
      }
      this.result.tables[this.currentTable].upDownLabel = upDownResult
        .value
        .values
        .map(INI.sanitize);
    }
  }

  private parseCurves(line: string) {
    // curve = time_accel_tpsdot_curve, "TPS based AE"
    const curveResult = P.seqObj<any>(
      P.string('curve'),
      this.space, this.equal, this.space,
      ['name', this.name],
      ...this.delimiter,
      ['title', this.inQuotes],
      P.all,
    ).parse(line);

    if (curveResult.status) {
      this.currentCurve = curveResult.value.name;
      this.result.curves[this.currentCurve!] = {
        title: INI.sanitize(curveResult.value.title),
        labels: [],
        xAxis: [],
        yAxis: [],
        xBins: [],
        yBins: [],
        size: [],
      };

      return;
    }

    // columnLabel = "TPSdot", "Added"
    const labelsResult = P.seqObj<any>(
      P.string('columnLabel'),
      this.space, this.equal, this.space,
      ['labels', this.values],
      P.all,
    ).parse(line);

    if (labelsResult.status) {
      if (!this.currentCurve) {
        throw new Error('Curve not set');
      }
      this.result.curves[this.currentCurve].labels = labelsResult
        .value
        .labels
        .map(INI.sanitize);

      return;
    }

    // xAxis = 0, 1200, 6
    // yAxis = 0, 1200, 6
    // xBins = taeBins, TPSdot
    // yBins = taeRates
    const parseAxis = (name: string) => P.seqObj<any>(
      P.string(name),
      this.space, this.equal, this.space,
      ['values', this.values],
      P.all,
    ).parse(line);

    const xAxisResult = parseAxis('xAxis');
    if (xAxisResult.status) {
      if (!this.currentCurve) {
        throw new Error('Curve not set');
      }
      this.result.curves[this.currentCurve].xAxis = xAxisResult
        .value
        .values
        .map((val: string) => INI.isNumber(val) ? Number(val) : INI.sanitize(val));

      return;
    }

    const yAxisResult = parseAxis('yAxis');
    if (yAxisResult.status) {
      if (!this.currentCurve) {
        throw new Error('Curve not set');
      }
      this.result.curves[this.currentCurve].yAxis = yAxisResult
        .value
        .values
        .map((val: string) => INI.isNumber(val) ? Number(val) : INI.sanitize(val));

      return;
    }

    const xBinsResult = parseAxis('xBins');
    if (xBinsResult.status) {
      if (!this.currentCurve) {
        throw new Error('Curve not set');
      }
      this.result.curves[this.currentCurve].xBins = xBinsResult
        .value
        .values
        .map((val: string) => INI.isNumber(val) ? Number(val) : INI.sanitize(val));

      return;
    }

    const yBinsResult = parseAxis('yBins');
    if (yBinsResult.status) {
      if (!this.currentCurve) {
        throw new Error('Curve not set');
      }
      this.result.curves[this.currentCurve].yBins = yBinsResult
        .value
        .values
        .map((val: string) => INI.isNumber(val) ? Number(val) : INI.sanitize(val));

      return;
    }

    const size = parseAxis('size');
    if (size.status) {
      if (!this.currentCurve) {
        throw new Error('Curve not set');
      }
      this.result.curves[this.currentCurve].size = size
        .value
        .values
        .map((val: string) => INI.isNumber(val) ? Number(val) : INI.sanitize(val));
    }
  }

  private parseDialogs(line: string) {
    const dialogBase: any = [
      P.string('dialog'),
      this.space, this.equal, this.space,
      ['name', this.name],
      ...this.delimiter,
      ['title', this.inQuotes],
    ];
    const dialogResult = P
      .seqObj<any>(
        ...dialogBase,
        ...this.delimiter,
        ['layout', this.name],
        P.all,
      )
      .or(P.seqObj<any>(...dialogBase, P.all))
      .parse(line);

    if (dialogResult.status) {
      this.currentDialog = dialogResult.value.name;
      this.result.dialogs[this.currentDialog!] = {
        title: INI.sanitize(dialogResult.value.title),
        layout: dialogResult.value.layout,
        panels: {},
        fields: [],
      };

      return;
    }

    // panel = knock_window_angle_curve
    const panelBase: any = [
      P.string('panel'),
      this.space, this.equal, this.space,
      ['name', this.name],
    ];

    // panel = knock_window_angle_curve, West
    const panelWithLayout = [
      ...panelBase,
      ...this.delimiter,
      ['layout', this.name],
    ];

    // panel = flex_fuel_curve, { flexEnabled }
    const panelWithCondition = [
      ...panelBase,
      ...this.delimiter,
      ['condition', this.expression],
    ];

    const panelResult = P
      .seqObj<any>(
        ...panelWithLayout,
        ...this.delimiter,
        ['condition', this.expression],
        P.all,
      )
      .or(P.seqObj<any>(
        ...panelWithCondition,
        P.all,
      ))
      .or(P.seqObj<any>(
        ...panelWithLayout,
        P.all,
      ))
      .or(P.seqObj<any>(
        ...panelBase,
        P.all,
      ))
      .parse(line);

    if (panelResult.status) {
      if (!this.currentDialog) {
        throw new Error('Dialog not set');
      }
      this.currentPanel = panelResult.value.name;

      this.result.dialogs[this.currentDialog!].panels[this.currentPanel!] = {
        layout: panelResult.value.layout,
        condition: panelResult.value.condition,
        fields: [],
        panels: {},
      };

      return;
    }

    // field = "Injector Layout"
    const fieldBase: any = [
      P.string('field'),
      this.space, this.equal, this.space,
      ['title', this.notQuote.wrap(...this.quotes)],
    ];

    // field = "Injector Layout", injLayout
    const fieldWithName = [
      ...fieldBase,
      ...this.delimiter,
      ['name', this.name],
    ];

    // field = "Low (E0) ", flexFreqLow, { flexEnabled }
    const fieldWithCondition = [
      ...fieldWithName,
      ...this.delimiter,
      ['condition', this.expression],
    ];

    // NOTE: this is probably a mistake, investigate that
    // field = "AUX Input 0", caninput_sel0a, {}, { (!enable_secondarySerial && (!enable_intcan || (enable_intcan && intcan_available == 0))) }
    const fieldWithDoubleCondition = [
      ...fieldWithName,
      ...this.delimiter,
      P.regexp(/{.*?}/),
      ...this.delimiter,
      ['condition', this.expression],
    ];

    const fieldResult = P
      .seqObj<any>(
        ...fieldWithDoubleCondition,
        P.all,
      )
      .or(P.seqObj<any>(
        ...fieldWithCondition,
        P.all,
      ))
      .or(P.seqObj<any>(
        ...fieldWithName,
        P.all,
      ))
      .or(P.seqObj<any>(
        ...fieldBase,
        P.all,
      ))
      .parse(line);

    if (fieldResult.status) {
      if (!this.currentDialog) {
        throw new Error('Dialog not set');
      }

      this.result.dialogs[this.currentDialog!].fields.push({
        name: fieldResult.value.name || '_fieldText_',
        title: INI.sanitize(fieldResult.value.title),
        condition: fieldResult.value.condition,
      });

      return;
    }

    // topicHelp = "https://wiki.speeduino.com/en/configuration/Engine_Constants"
    const helpResult = P
      .seqObj<any>(
        P.string('topicHelp'),
        this.space, this.equal, this.space,
        ['help', this.notQuote.wrap(...this.quotes)],
        P.all,
      )
      .parse(line);

    if (!this.currentDialog) {
      throw new Error('Dialog not set');
    }

    if (helpResult.status) {
      this.result.dialogs[this.currentDialog!].help = INI.sanitize(
        helpResult.value.help,
      );
    }

    // TODO: missing fields:
    // - settingSelector
    // - commandButton
    // - displayOnlyField
  }

  private parseKeyValueFor(section: string, line: string) {
    const { key, value } = this.parseKeyValue(line);

    if (this.result[section][key]) {
      // TODO: enable this for linting duplicates
      return;
      // throw new Error(`Key: ${key} for section: ${section} already exist`);
    }

    this.result[section][key] = value;
  }

  private parseKeyValue(line: string) {
    const base: any = [
      ['key', this.name],
      this.space, this.equal, this.space,
    ];

    const result = P
      .seqObj<any>(
        ...base,
        ['value', this.notQuote.wrap(...this.quotes)],
        P.all,
      )
      .or(P.seqObj<any>(
        ...base,
        ['value', this.numbers],
        P.all,
      ))
      .tryParse(line);

    return {
      key: result.key as string,
      value: INI.isNumber(result.value)
        ? Number(result.value)
        : INI.sanitize(result.value),
    };
  }

  private parseMenu(line: string) {
    // skip root "menuDialog = main" for now
    if (line.startsWith('menuDialog')) {
      return;
    }

    const menuResult = P
      .seqObj<any>(
        P.string('menu'),
        this.space, this.equal, this.space,
        ['name', this.inQuotes],
        P.all,
      ).parse(line);

    if (menuResult.status) {
      const title = INI
        .sanitize(menuResult.value.name)
        .replace(/&/g, '');
      const name = title
        .toLowerCase()
        .replace(/([^\w]\w)/g, (g) => g[1].toUpperCase()); // camelCase

      this.currentMenu = name;
      this.result.menus[this.currentMenu] = {
        title: INI.sanitize(title),
        subMenus: {},
      };
      return;
    }

    if (this.currentMenu) {
      // subMenu = std_separator
      const base: any = [
        P.string('subMenu'),
        this.space, this.equal, this.space,
        ['name', this.name],
      ];

      // subMenu = io_summary, "I/O Summary"
      const withTitle: any = [
        ...base,
        ...this.delimiter,
        ['title', this.notQuote.wrap(...this.quotes)],
      ];

      // subMenu = egoControl, "AFR/O2", 3
      const withPage: any = [
        ...withTitle,
        ...this.delimiter,
        ['page', P.digits],
      ];

      // subMenu = fuelTemp_curve, "Fuel Temp Correction", { flexEnabled }
      const withCondition: any = [
        ...withTitle,
        ...this.delimiter,
        ['condition', this.expression],
        P.all,
      ];

      // subMenu = inj_trimad_B, "Sequential fuel trim (5-8)", 9, { nFuelChannels >= 5 }
      const full: any = [
        ...withPage,
        ...this.delimiter,
        ['condition', this.expression],
      ];

      const subMenuResult = P.seqObj<any>(...full, P.all)
        .or(P.seqObj<any>(...withCondition, P.all))
        .or(P.seqObj<any>(...withPage, P.all))
        .or(P.seqObj<any>(...withTitle, P.all))
        .or(P.seqObj<any>(...base, P.all))
        .tryParse(line);

      this.result.menus[this.currentMenu].subMenus[subMenuResult.name] = {
        title: INI.sanitize(subMenuResult.title),
        page: Number(subMenuResult.page || 0),
        condition: subMenuResult.condition ? INI.sanitize(subMenuResult.condition) : '',
      };
    }
  }

  private parseDefines(line: string) {
    const result = P.seqObj<any>(
      P.string('#define'),
      this.space,
      ['name', this.name],
      this.space, this.equal, this.space,
      ['values', this.values],
      P.all,
    ).tryParse(line);

    this.result.defines[result.name] = result.values.map(INI.sanitize);

    const resolved = this.result.defines[result.name].map((val) => (
      val.startsWith('$')
        ? this.result.defines[val.slice(1)]
        : val
      )).flat();

    this.result.defines[result.name] = resolved;
  }

  private parsePcVariables(line: string) {
    if (line.startsWith('#define')) {
      this.parseDefines(line);
      return;
    }

    const result = this.parseConstAndVar(line, true);

    let constant = {} as Constant;
    switch (result.type) {
      case 'scalar':
        constant = {
          type: result.type,
          size: result.size,
          units: INI.sanitize(result.units),
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
          shape: INI.arrayShape(result.shape),
          units: INI.sanitize(result.units),
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
          address: result.address.split(':').map(Number),
          values: this.resolveBitsValues(result.name, result.values || []),
        };
        break;
      case 'string':
        constant = {
          type: result.type,
          size: result.size,
          length: Number(result.length),
        };
      break;
      default:
        break;
    }

    this.result.pcVariables[result.name] = constant;
  }

  private parseConstants(line: string) {
    if (line.startsWith('#define')) {
      this.parseDefines(line);
      return;
    }

    const page = P
      .seqObj<any>(
        P.string('page'),
        this.space, this.equal, this.space,
        ['page', P.digits],
        P.all,
      ).parse(line);

    if (page.status) {
      this.currentPage = Number(page.value.page) - 1;
      return;
    }

    if (INI.isNumber(this.currentPage)) {
      const result = this.parseConstAndVar(line);

      if (!this.result.constants.pages[this.currentPage!]) {
        this.result.constants.pages[this.currentPage!] = {
          number: this.currentPage! + 1,
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
            units: INI.sanitize(result.units),
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
            units: INI.sanitize(result.units),
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
            values: this.resolveBitsValues(result.name, result.values || []),
          };
          break;
        default:
          break;
      }

      if (this.result.constants.pages[this.currentPage!].data[result.name]) {
        // TODO: if else
        return;
      }

      this.result.constants.pages[this.currentPage!].data[result.name] = constant;
    }
  }

  private resolveBitsValues(name: string, values: string[]) {
    return values.map((val: string) => {
      const resolve = () => {
        const defineName = INI.sanitize(val.slice(1)); // name without $
        const resolved = this.result.defines[defineName];
        if (!resolved) {
          throw new Error(`Unable to resolve bits values for ${name}`);
        }

        return resolved;
      };

      return val.startsWith('$') ? resolve() : INI.sanitize(val);
    }).flat().filter((val) => val !== '');
  }

  private parseConstAndVar(line: string, asPcVariable = false) {
    const address: any = [
      ['address', P.regexp(/\d+:\d+/).trim(this.space).wrap(...this.sqrBrackets)],
    ];

    // first common (eg. name = scalar, U08, 3,)
    const base: any = (type: string) => {
      let list = [
        ['name', this.name],
        this.space, this.equal, this.space,
        ['type', P.string(type)],
        ...this.delimiter,
        ['size', this.size],
      ];

      // pcVariables don't have "offset"
      if (!asPcVariable) {
        list = [
          ...list,
          ...[
            ...this.delimiter,
            ['offset', P.digits],
          ],
        ];
      }

      return list;
    };

    const scalarShortRest: any = [
      ['units', P.alt(
        this.expression,
        this.inQuotes,
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
      P.all,
    );

    // normal version of array
    const array = P.seqObj<any>(
      ...base('array'),
      ...this.delimiter,
      ['shape', P.regexp(/\d+\s*(x\s*\d+)*/).trim(this.space).wrap(...this.sqrBrackets)],
      ...this.delimiter,
      ...scalarRest,
    );

    // normal version of bits
    const bits = P.seqObj<any>(
      ...base('bits'),
      ...this.delimiter,
      ...address,
      ...this.delimiter,
      ['values', this.values],
      P.all,
    );

    // short version of bits
    const bitsShort = P.seqObj<any>(
      ...base('bits'),
      ...this.delimiter,
      ...address,
      P.all,
    );

    // string (in pcVariables)
    const string = P.seqObj<any>(
      ...base('string'),
      ...this.delimiter,
      ['length', P.digits],
      P.all,
    );

    return scalar
      .or(scalarShort)
      .or(array)
      .or(bits)
      .or(bitsShort)
      .or(string)
      .tryParse(line);
  }

  private static numberOrExpression = (val: string | undefined | null) => INI.isNumber(val || '0') ? Number(val || 0) : INI.sanitize(`${val}`);

  private static sanitize = (val: any) => val === undefined ? '' : `${val}`.replace(/"/g, '').trim();

  private static isNumber = (val: any) => !Number.isNaN(Number(val));

  private static arrayShape = (val: string) => {
    const parts = INI.sanitize(val).split('x');
    return {
      columns: Number(parts[0]),
      rows: parts[1] ? Number(parts[1]) : 0,
    };
  };
}

const versions = [
  202012,
  202103,
];

versions.forEach((version) => {
  const result = new INI(
    fs.readFileSync(path.join(__dirname, `/../../public/tunes/${version}.ini`), 'utf8'),
  ).parse();

  fs.writeFileSync(path.join(__dirname, `/../../public/tunes/${version}.yml`), yaml.dump(result));
  fs.writeFileSync(path.join(__dirname, `/../../public/tunes/${version}.json`), JSON.stringify(result));
});

// const result = new INI(
//   fs.readFileSync(path.join(__dirname, `/../../public/tunes/${versions[1]}.ini`), 'utf8'),
// ).parse();
// console.dir(
//   result.outputChannels,
//   { depth: null, compact: false },
// );

console.log('------- end --------');
