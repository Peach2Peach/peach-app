import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { PeachText } from '../../text/PeachText'

type Props = {
  premium: number
}

export const PremiumText = ({ premium }: Props) => (
  <PeachText style={tw`text-black-65`}>
    {' '}
    {premium === 0
      ? i18n('match.atMarketPrice')
      : i18n(premium > 0 ? 'match.premium' : 'match.discount', String(Math.abs(premium)))}
  </PeachText>
)
