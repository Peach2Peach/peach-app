import { StyleProp, ViewStyle } from "react-native";
import { FlagType, Flags } from "./flags";
import { PeachText } from "./text/PeachText";

type Props = { id: FlagType; style?: StyleProp<ViewStyle> };

export const Flag = ({ id, style }: Props) => {
  const SVG = Flags[id];

  return SVG ? <SVG style={style} /> : <PeachText>❌</PeachText>;
};
