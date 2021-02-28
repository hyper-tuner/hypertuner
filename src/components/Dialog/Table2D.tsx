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
    .map((value, index) => <td key={`${name}-${axis}-${index}`}>{`${value}`}</td>);

  const titleProps = { disabled: true };
  const rowsCount = xData.length + 1;
  const generateCells = () => [
    Array(rowsCount).fill(false),
    Array(rowsCount).fill(false),
  ];
  const [cells, _setCells] = useState<boolean[][]>(generateCells());
  const cellsRef = useRef(cells);
  const setCells = (data: boolean[][]) => {
    cellsRef.current = data;
    _setCells(data);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const { key } = e;

    switch (key) {
      case '.':
        console.log('up');
        break;
      case ',':
        console.log('down');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setCells(generateCells());

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <div className="table table-2d">
      {cells[0].length === rowsCount && <TableDragSelect
        key={name}
        value={cells}
        onChange={setCells}
      >
        <tr>
          <td {...titleProps} className="title" key={yLabel}>{`${yLabel} (${yUnits})`}</td>
          {renderRow('y', yData)}
        </tr>
        <tr>
          <td {...titleProps} className="title" key={xLabel}>{`${xLabel} (${xUnits})`}</td>
          {renderRow('x', xData)}
        </tr>
      </TableDragSelect>}
    </div>
  );
};

export default Table2D;
