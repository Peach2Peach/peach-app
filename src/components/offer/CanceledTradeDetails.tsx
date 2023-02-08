import React from 'react'
import tw from '../../styles/tailwind'
import { SatsFormat } from '../text'

export const CanceledTradeDetails = ({ amount, style }: Contract & ComponentProps) => (
  <SatsFormat
    sats={amount}
    style={tw`subtitle-1 font-semibold`}
    containerStyle={style}
    bitcoinLogoStyle={tw`w-4 h-4 mr-1`}
    satsStyle={tw`body-s font-normal`}
  />
)
