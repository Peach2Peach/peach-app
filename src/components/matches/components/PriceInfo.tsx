import { useIsMediumScreen } from '../../../hooks/useIsMediumScreen'
import tw from '../../../styles/tailwind'
import { BTCAmount } from '../../bitcoin'
import { SatsFormat, Text } from '../../text'
import { Price } from '../Price'
import { PremiumText } from './PremiumText'

type PriceInfoProps = {
  match: Match
  offer: BuyOffer
}

export const PriceInfo = ({ match, offer }: PriceInfoProps) => {
  const isMediumScreen = useIsMediumScreen()
  return (
    <>
      <BTCAmount amount={match.amount} size={isMediumScreen ? 'large' : 'medium'} style={tw`self-center`} />
      <Text style={tw`text-center`}>
        <Price {...{ match, offer }} textStyle={tw`subtitle-1`} />
        <PremiumText premium={match.premium} />
      </Text>
    </>
  )
}
