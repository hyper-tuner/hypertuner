import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Skeleton,
  Button,
  Tooltip,
  message,
  Divider,
} from 'antd';
import { FireOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AppState } from '../types';
import Select from './Dialog/SmartSelect';

const mapStateToProps = (state: AppState) => ({
  config: state.config,
  tune: state.tune,
});

const containerStyle = {
  padding: 20,
};

const skeleton = () => <div style={containerStyle}><Skeleton /></div>;

const Dialog = ({ config, tune, name }: { config: any, tune: any, name: string }) => {
  if (!config || !config.signature) {
    return skeleton();
  }

  const dialogConfig = config.dialogs.find((dialog: any) => dialog.name === name);

  if (!dialogConfig) {
    message.error({
      content: 'Dialog not found',
    });

    return skeleton();
  }

  const groups = dialogConfig.groups.map((group: any) => (
      <div className="row">
        <Divider>{group.title}</Divider>
        {group.fields.map((field: any) => {
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
              input = <Select
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
      </div>
    ));

  return (
    <div style={containerStyle}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={(values: any) => console.log(values)}
      >
        {groups}
        <Form.Item>
          <Button
            type="primary"
            size="large"
            danger
            htmlType="submit"
            icon={<FireOutlined />}
            style={{ position: 'fixed', right: 25, bottom: 25 }}
          >
            Burn
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps)(Dialog);
