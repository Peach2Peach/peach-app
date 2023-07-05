import { Text } from '.'
import { priceFormat } from '../../utils/string'

type Props = ComponentProps & {
  amount: number
  currency: Currency
  round?: boolean
}

export const PriceFormat = ({ amount, currency, round, style }: Props) => (
  <Text style={style}>
    {priceFormat(amount, round)} {currency}
  </Text>
)
