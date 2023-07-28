import { Text } from '.'
import { groupChars, priceFormat } from '../../utils/string'

type Props = ComponentProps & {
  amount: number
  currency: Currency
  round?: boolean
}

export const PriceFormat = ({ amount, currency, round, style }: Props) => (
  <Text style={style}>
    {currency === 'SAT' ? groupChars(amount.toFixed(), 3) : priceFormat(amount, round)} {currency}
  </Text>
)
