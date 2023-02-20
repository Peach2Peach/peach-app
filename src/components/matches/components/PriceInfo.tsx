import React from 'react'
import tw from '../../../styles/tailwind'
import { SatsFormat } from '../../text'
import { Price } from '../Price'

type PriceInfoProps = {
  match: Match
}

export const PriceInfo = ({ match }: PriceInfoProps) => (
  <>
    <SatsFormat
      sats={match.amount}
      containerStyle={tw`self-center justify-center`}
      satsStyle={tw`subtitle-1`}
      style={tw`h5 leading-3xl`}
      bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
    />
    <Price match={match} />
  </>
)
