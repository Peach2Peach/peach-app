import { Text } from '..'
import PaymentLogos, { PaymentLogoType } from './logos'

type PaymentLogoProps = ComponentProps & {
  id: PaymentLogoType
}

export const PaymentLogo = ({ id, style }: PaymentLogoProps) => {
  const SVG = PaymentLogos[id]

  return SVG ? <SVG style={style} /> : <Text>❌</Text>
}

export default PaymentLogo
