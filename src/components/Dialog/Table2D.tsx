/* eslint-disable react/no-array-index-key */

import { useRef, useState } from 'react';

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
  const [editable, setEditable] = useState(false);
  const ref = useRef(null);
  const onDoubleClick = () => {
    setEditable((current) => !current);
    (ref.current as any).focus();
  };

  return (
    <td
      contentEditable={editable}
      suppressContentEditableWarning
      ref={ref}
      onDoubleClick={onDoubleClick}
      className={index > 0 ? 'value' : 'title'}
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
  const renderRow = (axis: Axis, input: (string | number)[]) => input
    .map((value, index) => <Cell axis={axis} key={index} index={index} value={value} />);

  return (
    <div className="table table-2d">
      <table>
        <tbody>
          <tr>{renderRow('y', [yLabel, ...yData])}</tr>
          <tr>{renderRow('x', [xLabel, ...xData])}</tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table2D;
