import { PeachText } from "../text/PeachText";
import { PaymentLogos, PaymentLogoType } from "./logos";

type Props = ComponentProps & {
  id: PaymentLogoType;
};

export const PaymentLogo = ({ id, style }: Props) => {
  const SVG = PaymentLogos[id];

  return SVG ? <SVG style={style} /> : <PeachText>❌</PeachText>;
};
