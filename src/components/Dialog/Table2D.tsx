/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */

import { useEffect, useRef, useState } from 'react';
import TableDragSelect from 'react-table-drag-select';

type Axis = 'x' | 'y';

const Cell = ({
  index,
  axis,
  value,
}: {
  index: number,
  axis: Axis,
  value: string | number,
}) => {
  const ref = useRef(null);

  // ref.current

  return (
    <td
      key={`${axis}-${index}`}
    >
      {value}
    </td>
  );
};

const Table2D = ({
  name,
  xLabel,
  yLabel,
  xData,
  yData,
  disabled,
  onEdit,
  xUnits = '',
  yUnits = '',
}: {
  name: string,
  xLabel: string,
  yLabel: string,
  xData: number[],
  yData: number[],
  disabled: boolean,
  onEdit: (axis: Axis, index: number, value: number) => void,
  xUnits?: string,
  yUnits?: string,
}) => {
  // const renderRow = (axis: Axis, input: (string | number)[]) => input
  //   .map((value, index) => <Cell axis={axis} key={index} index={index} value={value} />);

  const renderRow = (axis: Axis, input: (string | number)[]) => input
    .map((value, index) => (
      <td
        key={`${axis}-${index}`}
        onKeyPress={(e) => console.log(e.key)}
      >
        {`${value}`}
      </td>
    ));

  const titleProps = { disabled: true };
  const [data, setData] = useState([xData, yData]);
  const [labels, setLabels] = useState([xLabel, yLabel]);
  const columnsCells = new Array(data[0].length + 1).fill(false);
  const [cells, setCells] = useState<boolean[][]>([
    columnsCells,
    [...columnsCells],
  ]);
  useEffect(() => {
    // TODO: make keys for everything
    setCells([
      columnsCells,
      [...columnsCells],
    ]);
    setData([xData, yData]);
    setLabels([xLabel, yLabel]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xData, yData, xLabel, yLabel]);

  return (
    <div className="table table-2d">
      <TableDragSelect
        value={cells}
        onChange={setCells}
        key={name}
      >
        <tr>
          <td {...titleProps} className="title">{labels[1]}</td>
          {renderRow('y', data[1])}
        </tr>
        <tr>
          <td {...titleProps} className="title">{labels[0]}</td>
          {renderRow('x', data[0])}
        </tr>
      </TableDragSelect>
    </div>
  );
};

export default Table2D;
