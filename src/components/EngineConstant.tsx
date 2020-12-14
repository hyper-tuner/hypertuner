import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Skeleton,
  Card,
  Button,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AppState } from '../types';
import Select from './inputs/Select';

const mapStateToProps = (state: AppState) => {
  return {
    config: state.config,
    tune: state.tune,
  }
}

// const mapDispatchToProps = { increment, decrement, reset }

const Dialog = ({ config, tune }: any) => {
  if (!config || !config.signature) {
    return <Skeleton />;
  }

  const dialogConfig = config.dialogs[0].engineConstants;

  const groups = dialogConfig.groups.map((group: any) => {
    return (
      <Card key={group.title} title={group.title}>
        {group.fields.map((field: any) => {
          const constant = config.constants[field.name];
          const tuneField = tune.constants[field.name];
          let input;

          if (!tuneField) {
            // console.error('Field not found: ', field.name);
            return;
          }

          let enabled = true;
          if (field.condition) {
            // TODO: strip eval from `command` etc...!
            // https://www.electronjs.org/docs/tutorial/security
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
      </Card>
    )
  });

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={(values: any) => console.log(values)}
      >
        {groups}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Burn
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default connect(mapStateToProps)(Dialog);
