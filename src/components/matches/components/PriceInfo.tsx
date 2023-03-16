import React from 'react'
import { useConfigStore } from '../../../store/configStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { round } from '../../../utils/math'
import { SatsFormat, Text } from '../../text'
import { Price } from '../Price'

type PriceInfoProps = {
  match: Match
  offer: BuyOffer
}

export const PriceInfo = ({ match, offer }: PriceInfoProps) => {
  const peachFee = useConfigStore((state) => state.peachFee)
  const premiumWithFeeIncluded = match.premium + round(Math.ceil(match.amount * peachFee) / match.amount, 2) * 100
  return (
    <>
      <SatsFormat
        sats={match.amount - Math.ceil(match.amount * peachFee)}
        containerStyle={tw`self-center justify-center`}
        satsStyle={tw`subtitle-1`}
        style={tw`h5 leading-3xl`}
        bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
      />
      <Text style={tw`text-center`}>
        <Price {...{ match, offer }} textStyle={tw`subtitle-1`} />
        <Text style={tw`text-black-2`} testID={'premiumText'}>
          {' '}
          {premiumWithFeeIncluded === 0
            ? i18n('match.atMarketPrice')
            : i18n(
              premiumWithFeeIncluded > 0 ? 'match.premium' : 'match.discount',
              String(Math.abs(premiumWithFeeIncluded)),
            )}
        </Text>
      </Text>
    </>
  )
}
