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
}: {
  xLabel: string,
  yLabel: string,
  xData: number[],
  yData: number[],
  disabled: boolean,
  help: string,
}) => {
  const data = xData.map((val, index) => ({
    [xLabel]: val,
    [yLabel]: yData[index],
  }));
  const margin = 15;
  const mainColor = '#ccc';

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
              strokeDasharray="3 3"
              style={{ fill: mainColor }}
            />
            <XAxis dataKey={xLabel}>
              <Label
                value={xLabel}
                position="bottom"
                style={{ fill: mainColor }}
              />
            </XAxis>
            <YAxis domain={['auto', 'auto']}>
              <Label
                value={yLabel}
                position="left"
                angle={-90}
                style={{ fill: mainColor }}
              />
            </YAxis>
            <Tooltip />
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
