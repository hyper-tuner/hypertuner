import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Skeleton,
  Tooltip,
  message,
  Divider,
  Col,
  Row,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AppState } from '../types/state';
import SmartSelect from './Dialog/SmartSelect';
import {
  Dialog as DialogType,
  Group as GroupType,
  Config as ConfigType,
  Field as FieldType,
} from '../types/config';

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  tune: state.tune,
});

const containerStyle = {
  padding: 20,
};

const skeleton = () => <div style={containerStyle}><Skeleton /></div>;

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
    return skeleton();
  }

  const dialogConfig = config.dialogs.find((dialog: DialogType) => dialog.name === name);

  if (!dialogConfig) {
    message.error({
      content: 'Dialog not found',
    });

    return skeleton();
  }

  const groups = dialogConfig.groups.map((group: GroupType) => (
      <Col key={group.name} span={24} xl={12}>
        <Divider>{group.title}</Divider>
        {group.fields.map((field: FieldType) => {
          const constant = config.constants[field.name];
          const tuneField = tune.constants[field.name];
          let input;

          if (!tuneField) {
            return null;
          }

          let enabled = true;
          if (field.condition) {
            // TODO: strip eval from `command` etc...!
            // https://www.electronjs.org/docs/tutorial/security
            // eslint-disable-next-line no-eval
            enabled = eval(field.condition);
          }

          switch (constant.type) {
            case 'bits':
            case 'array':
              input = <SmartSelect
                        fieldName={field.name}
                        constant={constant}
                        value={tuneField.value}
                        disabled={!enabled}
                      />;
              break;

            case 'scalar':
              input = <InputNumber
                        key={field.name}
                        value={tuneField.value}
                        precision={tuneField.digits}
                        min={constant.min}
                        max={constant.max}
                        disabled={!enabled}
                        formatter={(value) => `${value}${tuneField.units}`}
                        parser={(value) => value ? value.replace(tuneField.units, '') : ''}
                      />;
              break;

            default:
              break;
          }

          return (
            <Form.Item
              key={field.name}
              label={
                <span>
                  {field.title}&nbsp;
                  <Tooltip title="What do you want others to call you?">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
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
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        onFinish={(values: any) => console.log(values)}
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
