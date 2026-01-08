import { Flags, FlagType } from "./flags";
import { PeachText } from "./text/PeachText";

type Props = ComponentProps & { id: FlagType };

export const Flag = ({ id, style }: Props) => {
  const SVG = Flags[id];

  return SVG ? (
    <SVG width={32} height={24} style={style} />
  ) : (
    <PeachText>❌</PeachText>
  );
};
