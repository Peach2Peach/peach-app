import { Text } from '..'
import PaymentLogos, { PaymentLogoType } from './logos'

type PaymentLogoProps = ComponentProps & {
  id: PaymentLogoType
}

/**
 * @description Component to display a payment logo
 * @param props Component properties
 * @param props.id payment logo id
 * @param [props.style] css style object
 * @example
 * <PaymentLogo id="amazon" style={tw`mt-4`} />
 */
export const PaymentLogo = ({ id, style }: PaymentLogoProps) => {
  const SVG = PaymentLogos[id]

  return SVG ? <SVG style={style} /> : <Text>❌</Text>
}

export default PaymentLogo
