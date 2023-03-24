import React from 'react'
import { create } from 'react-test-renderer'
import { SatsFormat } from '../components'
import tw from '../styles/tailwind'
import { TradeBreakdownSats } from './TradeBreakdownSats'

describe('TradeBreakdownSats', () => {
  it('renders correctly', () => {
    const testInstace = create(<TradeBreakdownSats amount={210000} />).root
    const satsFormat = testInstace.findByType(SatsFormat)
    expect(satsFormat.props).toStrictEqual({
      containerStyle: tw`items-start justify-between h-5 w-45`,
      bitcoinLogoStyle: tw`w-[18px] h-[18px] mr-2`,
      style: tw`font-normal leading-tight body-l`,
      satsStyle: tw`font-normal body-s`,
      sats: 210000,
    })
  })
})
