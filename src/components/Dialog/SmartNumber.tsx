import {
  InputNumber,
  Slider,
} from 'antd';

const SmartNumber = ({
  defaultValue,
  min,
  max,
  units,
  digits,
  disabled,
}: {
  defaultValue: number,
  min: number,
  max: number,
  units: string | undefined,
  digits: number,
  disabled: boolean,
}) => {
  const isSlider = (u: string) => ['%', 'C']
    .includes(`${u}`.toUpperCase());
  const sliderMarks: { [value: number]: string } = {};
  sliderMarks[min] = `${min}${units}`;

  if (min <= 0) {
    sliderMarks[0] = `0${units}`;
  }

  if (max) {
    sliderMarks[max] = `${max}${units}`;
  }

  if (isSlider(units || '')) {
    return (
      <Slider
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={10**-digits}
        disabled={disabled}
        marks={sliderMarks}
        tipFormatter={(val) => `${val}${units}`}
        // tooltipVisible
        // tooltipPlacement="bottom"
      />
    );
  }

  return (
    <InputNumber
      defaultValue={defaultValue}
      precision={digits}
      min={min}
      max={max}
      step={10**-digits}
      disabled={disabled}
      style={{ minWidth: 150 }}
      formatter={(val) => units ? `${val} ${units}` : `${val}`}
      parser={(val) => Number(`${val}`.replace(/[^\d.]/g, ''))}
    />
  );
};

export default SmartNumber;
