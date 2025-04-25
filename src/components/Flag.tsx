import { StyleProp, ViewStyle } from "react-native";
import { Flags } from "./flags";
import { PeachText } from "./text/PeachText";

type Props = { id: string; style?: StyleProp<ViewStyle> };

function isValidFlag(key: string): key is keyof typeof Flags {
  return key in Flags;
}
export const Flag = ({ id, style }: Props) => {
  if (isValidFlag(id)) {
    const SVG = Flags[id];
    return <SVG style={style} />;
  }

  return <PeachText>❌</PeachText>;
};
