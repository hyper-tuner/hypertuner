import { Typography } from 'antd';
import { useEffect, useState } from 'react';
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
  name,
  xLabel,
  yLabel,
  xData,
  yData,
  disabled,
  help,
  xUnits = '',
  yUnits = '',
}: {
  name: string,
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
  const [data, setData] = useState([xData, yData]);
  const margin = 15;
  const mainColor = '#ccc';
  const tooltipBg = '#2E3338';
  const animationDuration = 500;

  const onTableEdit = (axis: string, index: number, value: number) => {
    const x = [...xData];
    const y = [...yData];

    if (axis === 'x') {
      x[index] = value;
    } else {
      y[index] = value;
    }

    setData([x, y]);
  };

  useEffect(() => {
    setData([xData, yData]);
  }, [xData, yData, xLabel, yLabel]);

  return (
    <>
      <Typography.Paragraph>
        <Typography.Text type="secondary">{help}</Typography.Text>
      </Typography.Paragraph>
      <ResponsiveContainer height={450}>
        <LineChart
          data={mapData(data[0], data[1])}
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
            animationDuration={animationDuration}
          />
          <Line
            strokeWidth={3}
            type="linear"
            dataKey="y"
            stroke="#1e88ea"
            animationDuration={animationDuration}
          />
        </LineChart>
      </ResponsiveContainer>
      <Table2D
        name={name}
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
