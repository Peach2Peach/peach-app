import { View } from 'react-native'
import { Text } from '../../../components'
import { BTCAmount } from '../../../components/bitcoin'
import { getPremiumColor } from '../../../components/matches/utils'
import { useIsMediumScreen } from '../../../hooks/useIsMediumScreen'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = ComponentProps & {
  offer: SellOffer
}

export const MatchInformation = ({ offer, style }: Props) => {
  const { amount } = offer
  const color = getPremiumColor(offer.premium || 0, false)
  const isMediumScreen = useIsMediumScreen()

  return (
    <View style={style}>
      {isMediumScreen && <Text style={tw`text-center body-l text-black-2`}>{i18n('search.sellOffer')}:</Text>}
      <View style={tw`flex-row items-center justify-center`}>
        <BTCAmount amount={amount} size={isMediumScreen ? 'extra large' : 'medium'} style={tw`-mt-1`} />
        <Text style={[tw`leading-loose body-l`, color]}>
          {' '}
          ({offer.premium > 0 ? '+' : ''}
          {String(offer.premium)}%)
        </Text>
      </View>
    </View>
  )
}
