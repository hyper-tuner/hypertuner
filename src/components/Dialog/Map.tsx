/* eslint-disable react/no-array-index-key */

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  InputNumber,
  Modal,
  Popover,
  Space,
} from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import TableDragSelect from 'react-table-drag-select';
import {
  isDecrement,
  isEscape,
  isIncrement,
  isReplace,
} from '../../utils/keyboard/shortcuts';

type CellsType = boolean[][];
type DataType = number[][];
type OnChangeType = (data: DataType) => void;
enum Operations {
  INC,
  DEC,
  REPLACE,
}
type HslType = [number, number, number];

const Map = ({
  name,
  xData,
  yData,
  zData,
  disabled,
  onChange,
  zMin,
  zMax,
  digits,
  xUnits,
  yUnits,
}: {
  name: string,
  xData: number[],
  yData: number[],
  zData: number[][],
  disabled: boolean,
  onChange?: OnChangeType,
  zMin: number,
  zMax: number,
  digits: number,
  xUnits: string,
  yUnits: string,
}) => {
  const titleProps = { disabled: true };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalValue, setModalValue] = useState<number | undefined>();
  const [data, _setData] = useState<DataType>(zData);
  const generateCells = () => Array.from(
    Array(yData.length + 1).fill(false),
    () => new Array(xData.length + 1).fill(false),
  );
  const [cells, _setCells] = useState<CellsType>(generateCells());
  const cellsRef = useRef(cells);
  const dataRef = useRef(data);
  const modalInputRef = useRef<HTMLInputElement | null>(null);
  const setCells = (currentCells: CellsType) => {
    cellsRef.current = currentCells;
    _setCells(currentCells);
  };
  const setData = (currentData: DataType) => {
    dataRef.current = currentData;
    _setData(currentData);
    if (onChange) {
      onChange(currentData);
    }
  };
  const modifyData = (operation: Operations, currentCells: CellsType, currentData: DataType, value = 0): DataType => {
    const newData = [...currentData.map((row) => [...row])];
    currentCells.forEach((_, rowIndex) => {
      currentCells[rowIndex].forEach((selected, valueIndex) => {
        if (!selected) {
          return;
        }

        const current = newData[rowIndex][valueIndex - 1];
        switch (operation) {
          case Operations.INC:
            if (current < zMax) {
              newData[rowIndex][valueIndex - 1] = Number((newData[rowIndex][valueIndex - 1] + 10**-digits).toFixed(digits));
            }
            break;
          case Operations.DEC:
            if (current > zMin) {
              newData[rowIndex][valueIndex - 1] = Number((newData[rowIndex][valueIndex - 1] - 10**-digits).toFixed(digits));
            }
            break;
          case Operations.REPLACE:
            if (value > zMax) {
              newData[rowIndex][valueIndex - 1] = zMax;
              break;
            }
            if (value < zMin) {
              newData[rowIndex][valueIndex - 1] = zMin;
              break;
            }
            newData[rowIndex][valueIndex - 1] = value;
            break;
          default:
            break;
        }
      });
    });

    return [...newData];
  };

  const oneModalOk = () => {
    setData(modifyData(Operations.REPLACE, cellsRef.current, dataRef.current, modalValue));
    setIsModalVisible(false);
    setModalValue(undefined);
  };
  const onModalCancel = () => {
    setIsModalVisible(false);
    setModalValue(undefined);
  };
  const resetCells = () => setCells(generateCells());
  const increment = () => setData(modifyData(Operations.INC, cellsRef.current, dataRef.current));
  const decrement = () => setData(modifyData(Operations.DEC, cellsRef.current, dataRef.current));
  const replace = () => {
    // don't show modal when no cell is selected
    if (cellsRef.current.flat().find((val) => val === true)) {
      setModalValue(undefined);
      setIsModalVisible(true);
      setInterval(() => modalInputRef.current?.focus(), 1);
    }
  };

  useEffect(() => {
    const keyboardListener = (e: KeyboardEvent) => {

      if (isIncrement(e)) {
        increment();
      }
      if (isDecrement(e)) {
        decrement();
      }
      if (isReplace(e)) {
        e.preventDefault();
        replace();
      }
      if (isEscape(e)) {
        resetCells();
      }
    };

    document.addEventListener('keydown', keyboardListener);

    return () => {
      document.removeEventListener('keydown', keyboardListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colorHsl = (min: number, max: number, value: number): HslType => {
    const saturation = 60;
    const lightness = 40;
    const coldDeg = 220;
    const hotDeg = 0;
    const remap = (x: number, inMin: number, inMax: number, outMin: number, outMax: number) => (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    let hue = remap(value, min, max, coldDeg, hotDeg);

    // fallback to cold temp
    if (Number.isNaN(hue)) {
      hue = coldDeg;
    }

    return [hue, saturation, lightness];
  };

  const min = Math.min(...data.map((row) => Math.min(...row)));
  const max = Math.max(...data.map((row) => Math.max(...row)));

  const renderRow = (rowIndex: number, input: number[]) => input
    .map((value, index) => {
      const [hue, sat, light] = colorHsl(min, max, value);
      const yValue = yData[rowIndex];
      const result = [];

      if (index === 0) {
        result.push((
          <td {...titleProps} className="title-map" key={`y-${yValue}`}>
            {`${yValue}`}
          </td>
        ));
      }

      result.push((
        <td
          className="value"
          key={`${rowIndex}-${index}-${value}-${hue}${sat}${light}`}
          style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${light}%)` }}
        >
          {`${value}`}
        </td>
      ));

      return result;
    });

  return (
    <>
      <div className="table">
        <Popover
          visible={cells.flat().find((val) => val === true) === true}
          content={
            <Space>
              <Button onClick={decrement} icon={<MinusCircleOutlined />} />
              <Button onClick={increment} icon={<PlusCircleOutlined />} />
              <Button onClick={replace} icon={<EditOutlined />} />
            </Space>
          }
        >
          <TableDragSelect
            key={name}
            value={cells}
            onChange={setCells}
          >
            {data.map((row, i) => (
              <tr key={`row-${i}`}>
                {renderRow(i, row)}
              </tr>
            ))}
            <tr>
              <td {...titleProps} className="title-map">
                {yUnits} / {xUnits}
              </td>
              {xData.map((xValue) => (
                <td {...titleProps} key={`x-${xValue}`}>
                  {`${xValue}`}
                </td>
              ))}
            </tr>
          </TableDragSelect>
        </Popover>
      </div>
      <Modal
        title="Set cell values"
        visible={isModalVisible}
        onOk={oneModalOk}
        onCancel={onModalCancel}
        centered
        forceRender
      >
        <InputNumber
          ref={modalInputRef}
          value={modalValue}
          onChange={(val) => setModalValue(Number(val))}
          onPressEnter={oneModalOk}
          style={{ width: '20%' }}
        />
      </Modal>
    </>
  );
};

export default Map;
