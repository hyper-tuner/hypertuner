import {
  Radio,
  Select
} from 'antd';

const SmartSelect = ({
  values,
  defaultValue,
  disabled,
}: {
  values: string[],
  defaultValue: string,
  disabled: boolean,
}) => {

  if (values.length < 3) {
    return (
       <Radio.Group
        defaultValue={values.indexOf(defaultValue)}
        optionType="button"
        buttonStyle="solid"
        disabled={disabled}
      >
         {values.map((val: string, index) =>
          <Radio key={val} value={index}>{val}</Radio>
         )}
       </Radio.Group>
    );
  }

  return (
    <Select
      defaultValue={values.indexOf(defaultValue)}
      showSearch
      optionFilterProp="label"
      disabled={disabled}
      style={{ maxWidth: 250 }}
    >
      {/* we need to preserve indexes here, skip INVALID option */}
      {values.map((val: string, index) =>
        val === 'INVALID'
          ? null
          : <Select.Option key={val} value={index} label={val}>{val}</Select.Option>
      )}
    </Select>
  );
};

export default SmartSelect;
