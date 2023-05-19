import tw from '../../../styles/tailwind'
import { SatsFormat, Text } from '../../text'
import { Price } from '../Price'
import { PremiumText } from './PremiumText'

type PriceInfoProps = {
  match: Match
  offer: BuyOffer
}

export const PriceInfo = ({ match, offer }: PriceInfoProps) => (
  <>
    <SatsFormat
      sats={match.amount}
      containerStyle={tw`self-center justify-center`}
      satsStyle={tw`subtitle-1`}
      style={tw`h5 leading-3xl`}
      bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
    />
    <Text style={tw`text-center`}>
      <Price {...{ match, offer }} textStyle={tw`subtitle-1`} /> (
      <PremiumText style={tw`text-black-2`} premium={match.premium} />)
    </Text>
  </>
)
