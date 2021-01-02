import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
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
import {
  Dialogs as DialogsType,
  Dialog as DialogType,
  Config as ConfigType,
  Field as FieldType,
  Page as PageType,
} from '../types/config';

import {
  Tune as TuneType,
} from '../types/tune';

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

// TODO: refactor this! check and get rid of multiple calls and optimize
const Dialog = ({
  config,
  tune,
  name,
  burnButton
}: {
  config: ConfigType,
  tune: TuneType,
  name: string,
  burnButton: any
}) => {
  if (!config || !config.constants) {
    return skeleton;
  }

  const dialogConfig = config.dialogs[name];

  if (!dialogConfig) {
    return (
      <Result status="warning" title="Not found 👀" style={{ marginTop: 50 }} />
    );
  }

  const calculateSpan = (dialogsCount: number) => {
    let xxl = 24;
    let xl = 24;

    if (dialogsCount > 1) {
      xl = 12;
      xxl = dialogsCount === 2 ? 12 : 8;
    }

    return {
      span: 24,
      xxl,
      xl,
    };
  };

  const resolvedDialogs = {} as any; // TODO: describe

  const resolveDialogs = (source: DialogsType, dialogName: string) => {
    if (!source[dialogName]) {
      return;
    }

    // resolve root dialog
    resolvedDialogs[dialogName] = source[dialogName];

    Object.keys(source[dialogName].panels).forEach((panelName: string) => {
      const currentDialog = source[panelName];

      if (!currentDialog) {
        return;
      }

      if (currentDialog.fields.length > 0) {
        // resolve in root scope
        resolvedDialogs[panelName] = config.dialogs[panelName];
      }
        // NOTE: recursion
      resolveDialogs(config.dialogs, panelName);
    });
  };

  resolveDialogs(config.dialogs, name);

  // remove dummy dialogs and flatten to array
  const panels = Object.keys(resolvedDialogs).map((dialogName: string) => {
    const currentDialog: DialogType = resolvedDialogs[dialogName];
    const fields = currentDialog.fields
      .filter((field) => !['divider', '{}'].includes(field.name));

    return {
      name: dialogName,
      title: currentDialog.title,
      fields,
    };
  });

  const panelsComponents = panels.map((panel: { name: string, title: string, fields: FieldType[] }) => {
    if (panel.fields.length === 0) {
      return null;
    }

    return (
      <Col key={panel.name} {...calculateSpan(panels.length)}>
        <Divider>{panel.title}</Divider>
        {(panel.fields).map((field: FieldType) => {
          const pageFound = config
            .constants
            .pages
            .find((page: PageType) => field.name in page.data) || { data: {} } as PageType;
          const constant = pageFound.data[field.name];
          const tuneField = tune.constants[field.name];
          let input;

          if (!tuneField || !constant) {
            return null;
          }

          let enabled = true;
          if (field.condition) {
            console.info(`Condition for '${field.name}':`, field.condition);

            const constDeclarations = Object.keys(tune.constants)
              .map((constName: string) => {
                if (constName.includes('-')) {
                  return null;
                }

                let val = tune.constants[constName].value;

                if (typeof val === 'string' && val.includes('\n')) {
                  return null;
                }

                if (typeof val === 'string') {
                  val = `'${val}'`;
                }

                return `const ${constName} = ${val};`;
              });

            try {
              // TODO: strip eval from `command` etc
              // https://www.electronjs.org/docs/tutorial/security
              // eslint-disable-next-line no-eval
              enabled = eval(`
                'use strict';
                ${constDeclarations.join('')}
                ${field.condition};
              `);
            } catch (error) {
              console.log(`! Eval failed with: ${error.message}`);
            }
          }

          const precision = constant.units === '%' ? 0 : 1;

          switch (constant.type) {
            case 'bits':
            case 'array':
              input = <SmartSelect
                        defaultValue={tuneField.value}
                        values={constant.values}
                        globals={config.globals}
                        disabled={!enabled}
                      />;
              break;

            case 'scalar':
              input = <InputNumber
                        defaultValue={Number(tuneField.value)}
                        precision={precision}
                        min={constant.min || 0}
                        max={constant.max}
                        step={10**-precision}
                        disabled={!enabled}
                        style={{ minWidth: 150 }}
                        formatter={(value) => `${value}${constant.units || ''}`}
                        parser={(value) => value ? value.replace(constant.units || '', '') : ''}
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
                  {field.help && (<Popover content={
                    field.help.split('\n').map((line) => <div key={line}>{line}</div>)
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
      </Col>
    );
  });

  return (
    <div style={containerStyle}>
      {dialogConfig.help &&
        <Popover
          content={
            <a
              href={`${dialogConfig.help.link}`}
              target="__blank"
              rel="noopener noreferrer"
            >
              {dialogConfig.help.link}
            </a>
          }
          placement="right"
        >
          <QuestionCircleOutlined style={{ position: 'sticky', top: 15 }} />
        </Popover>
      }
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        // onFinish={(values: any) => console.log(values)}
      >
        <Row gutter={20}>
          {panelsComponents}
        </Row>
        <Form.Item>
          {burnButton}
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps)(Dialog);
