import { groupChars } from '../../utils/string/groupChars'
import { priceFormat } from '../../utils/string/priceFormat'
import { PeachText } from './PeachText'

type Props = ComponentProps & {
  amount: number
  currency: Currency
  round?: boolean
}

const GROUP_SIZE = 3

export const PriceFormat = ({ amount, currency, round, style }: Props) => (
  <PeachText style={style}>
    {currency === 'SAT' ? groupChars(amount.toFixed(), GROUP_SIZE) : priceFormat(amount, round)} {currency}
  </PeachText>
)
