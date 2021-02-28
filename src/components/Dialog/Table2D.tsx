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

  return (
    <td
      key={`${axis}-${index}`}
    >
      {value}
    </td>
  );
};

type CellsType = boolean[][];
type DataType = number[][];

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
  const renderRow = (axis: Axis, input: (string | number)[]) => input
    .map((value, index) => <td key={`${axis}-${index}-${value}`}>{`${value}`}</td>);

  const titleProps = { disabled: true };
  const [data, _setData] = useState<DataType>([yData, xData]);
  // data starts from `1` index, 0 is title / name
  const rowsCount = data[1].length + 1;
  const generateCells = () => [
    Array(rowsCount).fill(false),
    Array(rowsCount).fill(false),
  ];
  const [cells, _setCells] = useState<CellsType>(generateCells());
  const cellsRef = useRef(cells);
  const dataRef = useRef(data);
  const setCells = (currentCells: CellsType) => {
    cellsRef.current = currentCells;
    _setCells(currentCells);
  };
  const setData = (currentData: DataType) => {
    dataRef.current = currentData;
    _setData(currentData);
  };
  const modifyData = (sign: '-' | '+', currentCells: CellsType, currentData: DataType): DataType => {
    const newData = [...currentData.map((row) => [...row])];

    currentCells.forEach((_, rowIndex) => {
      currentCells[rowIndex].forEach((selected, valueIndex) => {
        if (!selected) {
          return;
        }

        if (sign === '+') {
          newData[rowIndex][valueIndex - 1] += 1;
        } else {
          newData[rowIndex][valueIndex - 1] -= 1;
        }
      });
    });

    return [...newData];
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const { key } = e;

    switch (key) {
      case '.':
        setData(modifyData('+', cellsRef.current, dataRef.current));
        break;
      case ',':
        setData(modifyData('-', cellsRef.current, dataRef.current));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="table table-2d">
      <TableDragSelect
        key={name}
        value={cells}
        onChange={setCells}
      >
        <tr>
          <td {...titleProps} className="title" key={yLabel}>{`${yLabel} (${yUnits})`}</td>
          {renderRow('y', data[0])}
        </tr>
        <tr>
          <td {...titleProps} className="title" key={xLabel}>{`${xLabel} (${xUnits})`}</td>
          {renderRow('x', data[1])}
        </tr>
      </TableDragSelect>
    </div>
  );
};

export default Table2D;
