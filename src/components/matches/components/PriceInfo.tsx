import { useIsMediumScreen } from '../../../hooks/useIsMediumScreen'
import tw from '../../../styles/tailwind'
import { BTCAmount } from '../../bitcoin'
import { Text } from '../../text'
import { Price } from './Price'
import { PremiumText } from './PremiumText'
import { View } from 'react-native'

type PriceInfoProps = {
  match: Match
  offer: BuyOffer
}

export const PriceInfo = ({ match, offer }: PriceInfoProps) => {
  const isMediumScreen = useIsMediumScreen()
  return (
    <View>
      <BTCAmount amount={match.amount} size={isMediumScreen ? 'large' : 'medium'} />
      <Text style={tw`text-black-3`}>
        <Price {...{ match, offer }} textStyle={tw`subtitle-1`} /> (
        <PremiumText style={tw`text-black-3`} premium={match.premium} />)
      </Text>
    </View>
  )
}
