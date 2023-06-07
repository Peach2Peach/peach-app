import { Text } from '.'
import { priceFormat } from '../../utils/string'

type PriceFormatProps = ComponentProps & {
  amount: number
  currency: Currency
  round?: boolean
}

export const PriceFormat = ({ amount, currency, round, style }: PriceFormatProps) => (
  <Text style={style}>
    {priceFormat(amount, round)} {currency}
  </Text>
)

export default PriceFormat
