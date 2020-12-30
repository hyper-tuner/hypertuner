import {
  // Radio,
  Select
} from 'antd';
import { Constant } from '../../types/config';

const SmartSelect = ({
  fieldName,
  constant,
  value,
  disabled,
}: {
  fieldName: string,
  constant: Constant,
  value: string | number,
  disabled: boolean,
}) => {
  const values = constant.values.filter((val: string) => val !== 'INVALID');

  // if (values.length < 3) {
  //   return (
  //      <Radio.Group value={value} optionType="button" buttonStyle="solid" onChange={onChange}>
  //        {values.map((val: string) =>
  //         <Radio key={val} value={val}>{val}</Radio>
  //        )}
  //      </Radio.Group>
  //   );
  // }

  return (
    <Select
      key={fieldName}
      value={value}
      showSearch
      disabled={disabled}
    >
      {values.map((val: string) =>
        <Select.Option key={val} value={val}>{val}</Select.Option>
      )}
    </Select>
  );
};

export default SmartSelect;
