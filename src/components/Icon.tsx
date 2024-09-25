import { ViewStyle } from "react-native";
import { FillProps } from "react-native-svg";
import { IconType, Icons } from "../assets/icons";
import tw from "../styles/tailwind";
import { PeachText } from "./text/PeachText";

type Props = {
  id: IconType;
  color?: FillProps["fill"] | ReturnType<typeof tw.color>;
  size?: number;
  style?: ViewStyle | ViewStyle[];
};
const defaultSize = 24;

export const Icon = ({ id, style, color, size }: Props) => {
  const SVG = Icons[id];
  const iconStyle = Array.isArray(style) ? style : [style];
  const iconSize = { width: size || defaultSize, height: size || defaultSize };

  return SVG ? (
    <SVG style={[iconSize, ...iconStyle]} fill={color || "#888"} />
  ) : (
    <PeachText>❌</PeachText>
  );
};
