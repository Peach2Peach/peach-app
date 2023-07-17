import tw from '../../../styles/tailwind'
import { PriceFormat, SatsFormat, Text } from '../../text'
import { PremiumText } from './PremiumText'
import { useMatchPriceData } from '../hooks'

type Props = {
  match: Match
  offer: BuyOffer | SellOffer
}

export const PriceInfo = ({ match, offer }: Props) => {
  const { premium, displayPrice, selectedCurrency } = useMatchPriceData(match, offer)
  return (
    <>
      <SatsFormat
        sats={match.amount}
        containerStyle={tw`self-center justify-center`}
        satsStyle={tw`subtitle-1`}
        style={tw`h5 leading-3xl`}
        bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
      />
      <Text style={tw`text-center`}>
        <PriceFormat style={tw`body-l subtitle-1`} currency={selectedCurrency} amount={displayPrice} />
        <PremiumText premium={premium} />
      </Text>
    </>
  )
}
