import { ViewStyle } from "react-native";
import { PaymentLogos, PaymentLogoType } from "./logos";

type Props = {
  style?: ViewStyle;
  id: PaymentLogoType;
};

export const PaymentLogo = ({ id, style }: Props) => {
  const SVG = PaymentLogos[id];
  const Placeholder = PaymentLogos.placeholder;

  return SVG ? <SVG style={style} /> : <Placeholder style={style} />;
};
