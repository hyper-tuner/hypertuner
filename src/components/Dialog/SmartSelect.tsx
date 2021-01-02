import {
  // Radio,
  Select
} from 'antd';
import {  Globals } from '../../types/config';

const SmartSelect = ({
  values,
  defaultValue,
  globals,
  disabled,
}: {
  values: string[],
  defaultValue: string | number,
  globals: Globals
  disabled: boolean,
}) => {
  let sanitized = values;

  // detect usage of global
  if (sanitized.length === 1 && sanitized[0].startsWith('$')) {
    sanitized = globals[sanitized[0].slice(1)];
  }

  sanitized = sanitized.filter((val: string) => val !== 'INVALID');

  // if (sanitized.length < 3) {
  //   return (
  //      <Radio.Group value={value} optionType="button" buttonStyle="solid" onChange={onChange}>
  //        {sanitized.map((val: string) =>
  //         <Radio key={val} value={val}>{val}</Radio>
  //        )}
  //      </Radio.Group>
  //   );
  // }

  return (
    <Select
      defaultValue={defaultValue}
      showSearch
      disabled={disabled}
    >
      {sanitized.map((val: string) =>
        <Select.Option key={val} value={val}>{val}</Select.Option>
      )}
    </Select>
  );
};

export default SmartSelect;
