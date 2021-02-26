import { Typography } from 'antd';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import Table2D from './Table2D';

const Curve = ({
  xLabel,
  yLabel,
  xData,
  yData,
  disabled,
  help,
  xUnits = '',
  yUnits = '',
}: {
  xLabel: string,
  yLabel: string,
  xData: number[],
  yData: number[],
  disabled: boolean,
  help: string,
  xUnits?: string,
  yUnits?: string,
}) => {
  const mapData = (inX: number[], inY: number[]) => inX.map((val, i) => ({
    x: val, y: inY[i],
  }));
  const [x, setX] = useState(xData);
  const [y, setY] = useState(yData);
  const [data, setData] = useState(mapData(x, y));
  const margin = 15;
  const mainColor = '#ccc';
  const tooltipBg = '#2E3338';

  const onTableEdit = (axis: string, index: number, value: number) => {
    if (axis === 'x') {
      x[index] = value;
      setX(x);
      return;
    }

    y[index] = value;
    setY(y);

    console.log({
      x, y,
    });
    setData(mapData(x, y));
  };

  return (
    <>
      <Typography.Paragraph>
        <Typography.Text type="secondary">{help}</Typography.Text>
      </Typography.Paragraph>
      <ResponsiveContainer height={450}>
        <LineChart
          data={data}
          margin={{
            top: margin,
            right: margin,
            left: margin,
            bottom: margin + 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            style={{ fill: mainColor }}
          />
          <XAxis dataKey="x">
            <Label
              value={`${xLabel} (${xUnits})`}
              position="bottom"
              style={{ fill: mainColor }}
            />
          </XAxis>
          <YAxis domain={['auto', 'auto']}>
            <Label
              value={`${yLabel} (${yUnits})`}
              position="left"
              angle={-90}
              style={{ fill: mainColor }}
            />
          </YAxis>
          <Tooltip
            labelFormatter={(value) => `${xLabel} : ${value} ${xUnits}`}
            formatter={(value: number) => [`${value} ${yUnits}`, yLabel]}
            contentStyle={{
              backgroundColor: tooltipBg,
              border: 0,
              boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
              borderRadius: 5,
            }}
          />
          <Line
            strokeWidth={3}
            type="linear"
            dataKey="y"
            stroke="#1e88ea"
          />
        </LineChart>
      </ResponsiveContainer>
      <Table2D
        xLabel={xLabel}
        yLabel={yLabel}
        xData={xData}
        yData={yData}
        disabled={disabled}
        xUnits={xUnits}
        yUnits={yUnits}
        onEdit={onTableEdit}
      />
    </>
  );
};

export default Curve;
