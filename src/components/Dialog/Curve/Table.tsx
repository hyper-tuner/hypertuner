/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */

import { useEffect, useRef, useState } from 'react';
import TableDragSelect from 'react-table-drag-select';
import { isDecrement, isIncrement, useDigits } from '../../../utils/keyboard/shortcuts';

type AxisType = 'x' | 'y';
type CellsType = boolean[][];
type DataType = number[][];
type OnChangeType = (data: DataType) => void;
enum Operations {
  INC,
  DEC,
  REPLACE,
}

const Table = ({
  name,
  xLabel,
  yLabel,
  xData,
  yData,
  disabled,
  onChange,
  xUnits = '',
  yUnits = '',
}: {
  name: string,
  xLabel: string,
  yLabel: string,
  xData: number[],
  yData: number[],
  disabled: boolean,
  onChange: OnChangeType,
  xUnits?: string,
  yUnits?: string,
}) => {
  const renderRow = (axis: AxisType, input: (string | number)[]) => input
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
    onChange(currentData);
  };
  const modifyData = (operation: Operations, currentCells: CellsType, currentData: DataType, value?: number): DataType => {
    const newData = [...currentData.map((row) => [...row])];

    currentCells.forEach((_, rowIndex) => {
      currentCells[rowIndex].forEach((selected, valueIndex) => {
        if (!selected) {
          return;
        }

        switch (operation) {
          case Operations.INC:
            newData[rowIndex][valueIndex - 1] += 1;
            break;
          case Operations.DEC:
            newData[rowIndex][valueIndex - 1] -= 1;
            break;
          case Operations.REPLACE:
            newData[rowIndex][valueIndex - 1] = value || 0;
            break;
          default:
            break;
        }
      });
    });

    return [...newData];
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (isIncrement(e)) {
      setData(
        modifyData(Operations.INC, cellsRef.current, dataRef.current),
      );
    }

    if (isDecrement(e)) {
      setData(
        modifyData(Operations.DEC, cellsRef.current, dataRef.current),
      );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isDigit, digit] = useDigits(e);
    if (isDigit) {
      setData(
        modifyData(Operations.REPLACE, cellsRef.current, dataRef.current, digit),
      );
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

export default Table;
