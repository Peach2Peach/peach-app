import { FillProps } from "react-native-svg";
import { Icons, IconType } from "../assets/icons";
import tw from "../styles/tailwind";
import { PeachText } from "./text/PeachText";

type Props = ComponentProps & {
  id: IconType;
  color?: FillProps["fill"] | ReturnType<typeof tw.color>;
  size?: number;
};
const defaultSize = tw`w-6`.width;

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
