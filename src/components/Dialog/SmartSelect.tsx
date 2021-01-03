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
  defaultValue: string | number,
  disabled: boolean,
}) => {

  if (values.length < 3) {
    return (
       <Radio.Group
        defaultValue={defaultValue}
        optionType="button"
        buttonStyle="solid"
        disabled={disabled}
      >
         {values.map((val: string) =>
          <Radio key={val} value={val}>{val}</Radio>
         )}
       </Radio.Group>
    );
  }

  return (
    <Select
      defaultValue={defaultValue}
      showSearch
      disabled={disabled}
      style={{ maxWidth: 250 }}
    >
      {values.map((val: string, index: number) =>
        val === 'INVALID'
          ? null
          : <Select.Option key={val} value={index}>{val}</Select.Option>
      )}
    </Select>
  );
};

export default SmartSelect;
