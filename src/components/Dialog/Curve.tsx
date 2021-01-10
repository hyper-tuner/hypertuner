import { ResponsiveLine } from '@nivo/line';
import { Typography } from 'antd';

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
  const data = [{
    id: 'curve',
    color: 'hsl(239, 70%, 50%)',
    data: xData.map((val, index) => ({ x: val, y: yData[index] })),
  }];

  return (
    <>
      <Typography.Text type="secondary">{help}</Typography.Text>
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={data}
          isInteractive={!disabled}
          margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          // yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: xLabel,
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yLabel,
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          useMesh
        />
      </div>
    </>
  );
};

export default Curve;
