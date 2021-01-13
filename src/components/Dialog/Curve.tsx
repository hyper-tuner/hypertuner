import { ResponsiveLineCanvas } from '@nivo/line';
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
    // color: 'hsl(239, 70%, 50%)',
    data: xData.map((val, index) => ({ x: val, y: yData[index] })),
  }];

  return (
    <>
      <Typography.Text type="secondary">{help}</Typography.Text>
      <div style={{ height: 450 }}>
        <ResponsiveLineCanvas
          data={data}
          isInteractive={disabled} // NOTE: this is buggy in built version
          margin={{ top: 30, right: 30, bottom: 60, left: 70 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          // colors={{ scheme: 'dark2' }}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          theme={{
            background: '#191C1E',
            textColor: '#ddd',
            fontSize: 14,
            grid: {
              line: {
                stroke: '#333',
              }
            }
          }}
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
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yLabel,
            legendOffset: -50,
            legendPosition: 'middle'
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          // useMesh
        />
      </div>
    </>
  );
};

export default Curve;
