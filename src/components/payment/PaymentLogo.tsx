import { ViewStyle } from "react-native";
import { PeachText } from "../text/PeachText";
import { PaymentLogos, PaymentLogoType } from "./logos";

type Props = {
  style?: ViewStyle;
  id: PaymentLogoType;
};

export const PaymentLogo = ({ id, style }: Props) => {
  const SVG = PaymentLogos[id];

  return SVG ? <SVG style={style} /> : <PeachText>❌</PeachText>;
};
