import i18n from '../../../utils/i18n'
import { Text } from '../../text'

type Props = ComponentProps & {
  premium: number
}

export const PremiumText = ({ premium, style }: Props) => (
  <Text style={style}>
    {premium === 0 ? i18n('atMarketPrice') : i18n(premium > 0 ? 'premium' : 'discount', String(Math.abs(premium)))}
  </Text>
)
