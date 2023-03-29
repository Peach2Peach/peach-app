import { ReactElement } from 'react'
import { Text } from '.'
import { priceFormat } from '../../utils/string'

type PriceFormatProps = ComponentProps & {
  amount: number
  currency: Currency
  round?: boolean
}

export const PriceFormat = ({ amount, currency, round, style }: PriceFormatProps): ReactElement => (
  <Text style={style}>
    {currency} {priceFormat(amount, round)}
  </Text>
)

export default PriceFormat
