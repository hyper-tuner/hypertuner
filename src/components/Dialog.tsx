import { connect } from 'react-redux';
import {
  Form,
  Skeleton,
  Divider,
  Col,
  Row,
  Popover,
  Space,
  Result,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AppState } from '../types/state';
import SmartSelect from './Dialog/SmartSelect';
import SmartNumber from './Dialog/SmartNumber';
import TextField from './Dialog/TextField';
import Curve from './Dialog/Curve';
import {
  Dialogs as DialogsType,
  Dialog as DialogType,
  Config as ConfigType,
  Field as FieldType,
  Curve as CurveType,
  Table as TableType,
  ScalarConstant as ScalarConstantType,
  ConstantTypes,
} from '../types/config';
import {
  Tune as TuneType,
} from '../types/tune';
import { findOnPage } from '../utils/config/find';
import { parseXy, parseZ } from '../utils/tune/table';
import Map from './Dialog/Map';
import { evaluateExpression, isExpression } from '../utils/tune/expression';

interface DialogsAndCurves {
  [name: string]: DialogType | CurveType | TableType,
}

interface RenderedPanel {
  type: string,
  name: string,
  title: string;
  labels: string[];
  xAxis: number[];
  yAxis: number[];
  xBins: string[];
  yBins: string[];
  size: number[];
  gauge?: string;
  fields: FieldType[],
  map: string;
  page: number;
  help?: string;
  xyLabels: string[];
  zBins: string[];
  gridHeight: number;
  gridOrient: number[];
  upDownLabel: string[];
}

enum PanelTypes {
  FIELDS = 'fields',
  CURVE = 'curve',
  TABLE = 'table',
}

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  tune: state.tune,
});

const containerStyle = {
  padding: 20,
};

const skeleton = (<div style={containerStyle}>
  <Skeleton /><Skeleton />
</div>);

// TODO: refactor this
const Dialog = ({
  config,
  tune,
  name,
  burnButton,
}: {
  config: ConfigType,
  tune: TuneType,
  name: string,
  burnButton: any
}) => {
  const isDataReady = Object.keys(tune.constants).length && Object.keys(config.constants).length;

  const renderHelp = (link?: string) => (link &&
    <Popover
      content={
        <a
          href={`${link}`}
          target="__blank"
          rel="noopener noreferrer"
        >
          {link}
        </a>
      }
      placement="right"
    >
      <QuestionCircleOutlined
        style={{ position: 'sticky', top: 15, zIndex: 1 }}
      />
    </Popover>
  );

  const renderCurve = (curve: CurveType) => {
    const x = tune.constants[curve.xBins[0]];
    const y = tune.constants[curve.yBins[0]];
    const xConstant = findOnPage(config, curve.xBins[0]) as ScalarConstantType;
    const yConstant = findOnPage(config, curve.yBins[0]) as ScalarConstantType;

    return (
      <Curve
        name={curve.yBins[0]}
        key={curve.yBins[0]}
        disabled={false} // TODO: evaluate condition
        help={config.help[curve.yBins[0]]}
        xLabel={curve.labels[0]}
        yLabel={curve.labels[1]}
        xUnits={xConstant.units}
        yUnits={yConstant.units}
        xMin={xConstant.min as number}
        xMax={xConstant.max as number}
        yMin={yConstant.min as number}
        yMax={yConstant.max as number}
        xData={parseXy(x.value as string)}
        yData={parseXy(y.value as string)}
      />
    );
  };

  const renderTable = (table: TableType | RenderedPanel) => {
    const x = tune.constants[table.xBins[0]];
    const y = tune.constants[table.yBins[0]];
    const z = tune.constants[table.zBins[0]];
    const zConstant = findOnPage(config, table.zBins[0]) as ScalarConstantType;

    // console.log({
    //   table,
    //   x,
    //   y,
    //   z,
    //   zConstant,
    //   zData: parseZ(z.value as string),
    // });

    let max = 0;
    if (isExpression(zConstant.max)) {
      max = evaluateExpression(zConstant.max as string, tune.constants, config);
    }

    let min = 0;
    if (isExpression(zConstant.min)) {
      min = evaluateExpression(zConstant.min as string, tune.constants, config);
    }

    return <div>
      {renderHelp(table.help)}
      <Map
        name={table.map}
        key={table.map}
        xData={parseXy(x.value as string)}
        yData={parseXy(y.value as string).reverse()}
        zData={parseZ(z.value as string)}
        disabled={false}
        zMin={min}
        zMax={max}
        digits={zConstant.digits as number}
        xUnits={x.units as string}
        yUnits={y.units as string}
      />
    </div>;
  };

  if (!isDataReady) {
    return skeleton;
  }

  const dialogConfig = config.dialogs[name];
  const curveConfig = config.curves[name];
  const tableConfig = config.tables[name];

  // standalone dialog / page
  if (!dialogConfig) {
    if (curveConfig) {
      return (
        <div style={containerStyle}>
          <Divider>{curveConfig.title}</Divider>
          {renderCurve(curveConfig)}
        </div>
      );
    }

    if (tableConfig) {
      return (
        <div style={containerStyle}>
          {renderHelp(tableConfig.help)}
          <Divider>{tableConfig.title}</Divider>
          {renderTable(tableConfig)}
        </div>
      );
    }

    return (
      <Result status="warning" title="Not found 👀" style={{ marginTop: 50 }} />
    );
  }

  const calculateSpan = (dialogsCount: number) => {
    let xxl = 24;
    const xl = 24;

    if (dialogsCount > 1) {
      xxl = 12;
    }

    return {
      span: 24,
      xxl,
      xl,
    };
  };

  const resolvedDialogs: DialogsAndCurves = {};

  const resolveDialogs = (source: DialogsType, dialogName: string) => {
    if (!source[dialogName]) {
      return;
    }

    // resolve root dialog
    resolvedDialogs[dialogName] = source[dialogName];

    Object.keys(source[dialogName].panels).forEach((panelName: string) => {
      const currentDialog = source[panelName];

      if (!currentDialog) {
        // resolve 2D map / curve panel
        if (config.curves[panelName]) {
          resolvedDialogs[panelName] = {
            ...config.curves[panelName],
          };

          return;
        }

        // resolve 3D map / table panel
        if (config.tables[panelName]) {
          resolvedDialogs[panelName] = {
            ...config.tables[panelName],
          };

          return;
        }

        console.info('Unable to resolve panel:', panelName);

        return;
      }

      if (currentDialog.fields.length > 0) {
        // resolve in root scope
        resolvedDialogs[panelName] = config.dialogs[panelName];
      }

      // recursion
      resolveDialogs(config.dialogs, panelName);
    });
  };

  // TODO: refactor this
  resolveDialogs(config.dialogs, name);

  // remove dummy dialogs and flatten to array
  const panels = Object.keys(resolvedDialogs).map((dialogName: string): RenderedPanel => {
    const currentDialog: DialogType | CurveType | TableType = resolvedDialogs[dialogName];
    let type = PanelTypes.CURVE;
    let fields: FieldType[] = [];

    if ('fields' in currentDialog) {
      type = PanelTypes.FIELDS;
      fields = (currentDialog as DialogType)
        .fields
        .filter((field) => field.title !== '' );
    } else if ('zBins' in currentDialog) {
      type = PanelTypes.TABLE;
    }

    return {
      type,
      name: dialogName,
      title: currentDialog.title,
      fields,
      labels: (currentDialog as CurveType).labels,
      xAxis: (currentDialog as CurveType).xAxis,
      yAxis: (currentDialog as CurveType).yAxis,
      xBins: (currentDialog as CurveType).xBins,
      yBins: (currentDialog as CurveType).yBins,
      size: (currentDialog as CurveType).size,
      gauge: (currentDialog as CurveType).gauge,
      map: (currentDialog as TableType).map,
      page: (currentDialog as TableType).page,
      help: (currentDialog as TableType).help,
      xyLabels: (currentDialog as TableType).xyLabels,
      zBins: (currentDialog as TableType).zBins,
      gridHeight: (currentDialog as TableType).gridHeight,
      gridOrient: (currentDialog as TableType).gridOrient,
      upDownLabel: (currentDialog as TableType).upDownLabel,
    };
  });

  const panelsComponents = () => panels.map((panel: RenderedPanel) => {
    if (panel.type === PanelTypes.FIELDS && panel.fields.length === 0) {
      return null;
    }

    return (
      <Col key={panel.name} {...calculateSpan(panels.length)}>
        <Divider>{panel.title}</Divider>
        {(panel.fields).map((field: FieldType) => {
          const constant = findOnPage(config, field.name);
          const tuneField = tune.constants[field.name];
          const help = config.help[field.name];
          let input;
          let enabled = true;

          if (field.condition) {
            enabled = evaluateExpression(field.condition, tune.constants, config);
          }

          if (field.name === '_fieldText_' && enabled) {
            return <TextField key={`${panel.name}-${field.title}`} title={field.title} />;
          }

          if (!tuneField) {
            // TODO: handle this?
            // name: "rpmwarn", title: "Warning",
            return null;
          }

          switch (constant.type) {
            // case ConstantTypes.ARRAY: // TODO: arrays
            case ConstantTypes.BITS:
              input = <SmartSelect
                        defaultValue={`${tuneField.value}`}
                        values={constant.values as string[]}
                        disabled={!enabled}
                      />;
              break;

            case ConstantTypes.SCALAR:
              input = <SmartNumber
                        defaultValue={Number(tuneField.value)}
                        digits={(constant as ScalarConstantType).digits}
                        min={((constant as ScalarConstantType).min as number) || 0}
                        max={(constant as ScalarConstantType).max as number}
                        disabled={!enabled}
                        units={(constant as ScalarConstantType).units}
                      />;
              break;

            default:
              break;
          }

          return (
            <Form.Item
              key={field.name}
              label={
                <Space>
                  {field.title}
                  {help && (<Popover content={
                    help.split('\\n').map((line) => <div key={line}>{line}</div>)
                  }>
                    <QuestionCircleOutlined />
                  </Popover>)}
                </Space>
              }
            >
              {input}
            </Form.Item>
          );
        })}

        {panel.type === PanelTypes.CURVE && renderCurve(panel)}

        {panel.type === PanelTypes.TABLE && renderTable(panel)}
      </Col>
    );
  });

  return (
    <div style={containerStyle}>
      {renderHelp(dialogConfig?.help)}
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
      >
        <Row gutter={20}>
          {isDataReady && panelsComponents()}
        </Row>
        <Form.Item>
          {burnButton}
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps)(Dialog);
