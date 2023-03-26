import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { SatsFormat, Text } from '../../text'
import { Price } from '../Price'

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
      <Price {...{ match, offer }} textStyle={tw`subtitle-1`} />
      <Text style={tw`text-black-2`} testID={'premiumText'}>
        {' '}
        {match.premium === 0
          ? i18n('match.atMarketPrice')
          : i18n(match.premium > 0 ? 'match.premium' : 'match.discount', String(Math.abs(match.premium)))}
      </Text>
    </Text>
  </>
)
