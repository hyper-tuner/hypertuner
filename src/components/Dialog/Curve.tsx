import { Typography } from 'antd';
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
  const data = xData.map((val, index) => ({
    [xLabel]: val,
    [yLabel]: yData[index],
  }));
  const margin = 15;
  const mainColor = '#ccc';
  const tooltipBg = '#2E3338';

  return (
    <>
      <Typography.Paragraph>
        <Typography.Text type="secondary">{help}</Typography.Text>
      </Typography.Paragraph>
      <div style={{ height: 450 }}>
        <ResponsiveContainer>
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
            <XAxis dataKey={xLabel}>
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
              formatter={(value: number) => `${value} ${yUnits}`}
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
              dataKey={yLabel}
              stroke="#1e88ea"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Curve;
