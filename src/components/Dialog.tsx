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
  Dialog as DialogType,
  Group as GroupType,
  Config as ConfigType,
  Field as FieldType,
  Page as PageType,
} from '../types/config';

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

// TODO: refactor this! check and get rid of multiple calls
const Dialog = ({
  config,
  tune,
  name,
  burnButton
}: {
  config: ConfigType,
  tune: any,
  name: string,
  burnButton: any
}) => {
  if (!config || !config.signature) {
    return skeleton;
  }

  const dialogConfig = config.dialogs.find((dialog: DialogType) => dialog.name === name);

  if (!dialogConfig) {
    return (
      <Result status="warning" title="Not found 👀" style={{ marginTop: 50 }} />
    );
  }

  const dialogGroups = dialogConfig.groups || [];

  const groups = dialogGroups.map((group: GroupType) => (
      <Col key={group.name} span={24} xxl={8} xl={12}>
        <Divider>{group.title}</Divider>
        {(group.fields || []).map((field: FieldType) => {
          const pageFound = config.pages.find((page: PageType) => 'reqFuel' in page.constants) || { constants: {} } as PageType;
          const constant = pageFound.constants[field.name];
          const tuneField = tune.constants[field.name];
          let input;

          if (!tuneField || !constant) {
            return null;
          }

          let enabled = true;
          if (field.condition) {
            // TODO: strip eval from `command` etc...!
            // https://www.electronjs.org/docs/tutorial/security
            // eslint-disable-next-line no-eval
            enabled = eval(field.condition);
          }

          const precision = constant.units === '%' ? 0 : 1;

          switch (constant.type) {
            case 'bits':
            case 'array':
              input = <SmartSelect
                        defaultValue={tuneField.value}
                        constant={constant}
                        disabled={!enabled}
                      />;
              break;

            case 'scalar':
              input = <InputNumber
                        defaultValue={tuneField.value}
                        precision={precision}
                        min={constant.min || 0}
                        max={constant.max}
                        step={10**-precision}
                        disabled={!enabled}
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
    ));

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
          {groups}
        </Row>
        <Form.Item>
          {burnButton}
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps)(Dialog);
