/* eslint-disable react/no-array-index-key */

import { useRef, useState } from 'react';
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
  xLabel,
  yLabel,
  xData,
  yData,
  disabled,
  onEdit,
  xUnits = '',
  yUnits = '',
}: {
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
    .map((value, index) => <td key={`${axis}-${index}`}>{`${value}`}</td>);

  const columnsCells = new Array(xData.length + 1).fill(false);
  const [cells, setCells] = useState([
    columnsCells,
    [...columnsCells],
  ]);
  const titleProps = { disabled: true };

  return (
    <div className="table table-2d">
      <TableDragSelect
        value={cells}
        onChange={setCells}
      >
        <tr>
          <td {...titleProps} className="title">{yLabel}</td>
          {renderRow('y', yData)}
        </tr>
        <tr>
          <td {...titleProps} className="title">{xLabel}</td>
          {renderRow('x', xData)}
        </tr>
      </TableDragSelect>
    </div>
  );
};

export default Table2D;
