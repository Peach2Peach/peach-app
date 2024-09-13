import { useMemo } from "react";
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

import QRCode from "qrcode";
import tw from "../../styles/tailwind";

type Props = {
  value: string;
  size: number;
};

function QRCodeComponent({ value, size }: Props) {
  const result = useMemo(
    () => transformMatrixIntoPath(genMatrix(value), size),
    [value, size],
  );

  if (!result) {
    return null;
  }

  const { path, cellSize } = result;

  return (
    <Svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <Defs>
        <LinearGradient id="grad" x1={"0%"} y1={"0%"} x2={"100%"} y2={"100%"}>
          <Stop offset="0" stopColor={"rgb(255,0,0)"} stopOpacity="1" />
          <Stop offset="1" stopColor={"rgb(0,0,255)"} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <G>
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill={tw.color("primary-background-main")}
        />
      </G>
      <G>
        <Path
          d={path}
          strokeLinecap="butt"
          stroke={tw.color("black-100")}
          strokeWidth={cellSize}
        />
      </G>
    </Svg>
  );
}

function genMatrix(value: string) {
  const arr = Array.prototype.slice.call(QRCode.create(value).modules.data, 0);
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    [],
  );
}

function transformMatrixIntoPath(matrix: number[][], size: number) {
  const cellSize = size / matrix.length;
  let path = "";
  matrix.forEach((row, i) => {
    let needDraw = false;
    row.forEach((column, j) => {
      if (column) {
        if (!needDraw) {
          path += `M${cellSize * j} ${cellSize / 2 + cellSize * i} `;
          needDraw = true;
        }
        if (needDraw && j === matrix.length - 1) {
          path += `L${cellSize * (j + 1)} ${cellSize / 2 + cellSize * i} `;
        }
      } else if (needDraw) {
        path += `L${cellSize * j} ${cellSize / 2 + cellSize * i} `;
        needDraw = false;
      }
    });
  });
  return {
    cellSize,
    path,
  };
}
export default QRCodeComponent;
