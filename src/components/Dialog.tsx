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
} from '../types/config';
import {
  Tune as TuneType,
} from '../types/tune';
import { prepareConstDeclarations } from '../lib/utils';
import { findOnPage } from '../utils/config/find';

interface DialogsAndCurves {
  [name: string]: DialogType | CurveType,
}

interface RenderedPanel extends CurveType {
  type: string,
  name: string,
  condition: string,
  fields: FieldType[],
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

  const curveComponent = (curve: CurveType) => {
    const x = tune.constants[curve.xBins[0]];
    const y = tune.constants[curve.yBins];
    const xConstant = findOnPage(config, curve.xBins[0]);
    const yConstant = findOnPage(config, curve.yBins);
    console.log({ curve });

    return (
      <Curve
        name={curve.yBins}
        key={curve.yBins}
        disabled={false} // TODO: evaluate condition
        help={config.help[curve.yBins]}
        xLabel={curve.labels[0]}
        yLabel={curve.labels[1]}
        xUnits={x.units}
        yUnits={y.units}
        xMin={xConstant.min}
        xMax={xConstant.max}
        yMin={yConstant.min}
        yMax={yConstant.max}
        xData={
          (x.value as string)
            .split('\n')
            .map((val) => val.trim())
            .filter((val) => val !== '')
            .map(Number)
        }
        yData={
          (y.value as string)
            .split('\n')
            .map((val) => val.trim())
            .filter((val) => val !== '')
            .map(Number)
        }
      />
    );
  };

  if (!isDataReady) {
    return skeleton;
  }

  const dialogConfig = config.dialogs[name];
  const curveConfig = config.curves[name];

  if (!dialogConfig) {
    if (curveConfig) {
      return (
        <div style={containerStyle}>
          <Divider>{curveConfig.title}</Divider>
          {curveComponent(curveConfig)}
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
        if (!config.curves[panelName]) {
          console.error('Panel does not exists:', panelName);

          return;
        }

        // resolve 2D map / curve panel
        resolvedDialogs[panelName] = {
          ...config.curves[panelName],
          condition: source[dialogName].panels[panelName].condition,
        };

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
    const currentDialog: DialogType | CurveType = resolvedDialogs[dialogName];
    const type = 'fields' in currentDialog ? 'fields' : 'curve';
    const fields = type === 'curve' ? [] : (currentDialog as DialogType).fields
      .filter((field) => field.title !== '' );

    return {
      type,
      name: dialogName,
      title: currentDialog.title,
      condition: currentDialog.condition,
      fields,
      labels: (currentDialog as CurveType).labels,
      xAxis: (currentDialog as CurveType).xAxis,
      yAxis: (currentDialog as CurveType).yAxis,
      xBins: (currentDialog as CurveType).xBins,
      yBins: (currentDialog as CurveType).yBins,
      size: (currentDialog as CurveType).size,
      gauge: (currentDialog as CurveType).gauge,
    };
  });

  const panelsComponents = () => panels.map((panel: RenderedPanel) => {
    if (panel.type === 'fields' && panel.fields.length === 0) {
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
            // TODO: move this outside and evaluate, return object / array
            const constDeclarations = prepareConstDeclarations(tune.constants, config.constants.pages);
            try {
              // TODO: strip eval from `command` etc
              // https://www.electronjs.org/docs/tutorial/security
              // eslint-disable-next-line no-eval
              enabled = eval(`
                'use strict';
                ${constDeclarations.join('')}
                ${field.condition};
              `);

              // console.info(`Evaluated condition for '${field.name}':`, field.condition, ': result:', enabled);
            } catch (error) {
              console.error('Field condition evaluation failed with:', error.message);
            }
          }

          if (field.name === '_fieldText_' && enabled) {
            return <TextField key={`${panel.name}-${field.title}`} title={field.title} />;
          }

          if (!tuneField) {
            // TODO: handle this?
            // name: "rpmwarn", title: "Warning",
            return null;
          }

          const units = constant.units === ':1' ? '' : constant.units;
          switch (constant.type) {
            case 'bits':
            case 'array':
              input = <SmartSelect
                        defaultValue={`${tuneField.value}`}
                        values={constant.values as string[]}
                        disabled={!enabled}
                      />;
              break;

            case 'scalar':
              input = <SmartNumber
                        defaultValue={Number(tuneField.value)}
                        digits={constant.digits}
                        min={constant.min || 0}
                        max={constant.max}
                        disabled={!enabled}
                        units={units}
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

        {panel.type === 'curve' && curveComponent(panel)}
      </Col>
    );
  });

  return (
    <div style={containerStyle}>
      {dialogConfig.help &&
        <Popover
          content={
            <a
              href={`${dialogConfig.help}`}
              target="__blank"
              rel="noopener noreferrer"
            >
              {dialogConfig.help}
            </a>
          }
          placement="right"
        >
          <QuestionCircleOutlined
            style={{ position: 'sticky', top: 15, zIndex: 1 }}
          />
        </Popover>
      }
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
