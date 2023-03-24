import React from 'react'
import { View } from 'react-native'
import { create } from 'react-test-renderer'
import i18n from '../../../utils/i18n'
import { SatsFormat } from '../../text'
import { PriceInfo } from './PriceInfo'

jest.mock('../Price', () => ({
  Price: () => <View />,
}))

describe('PriceInfo', () => {
  it('should show sats', () => {
    const amount = 210000
    const matchMock = { amount, premium: 7 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    expect(testInstance.findByType(SatsFormat).props.sats).toBe(amount)
  })
  it('should show text corresponding to the premium', () => {
    const amount = 100000
    const matchMock = { amount, premium: 7 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    const textElement = testInstance.findByProps({ testID: 'premiumText' })
    const expectedText = [' ', i18n('match.premium', '7')]

    expect(textElement.props.children).toStrictEqual(expectedText)
  })

  it('should show text corresponding to the discount', () => {
    const amount = 100000
    const matchMock = { amount, premium: -2 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    const textElement = testInstance.findByProps({ testID: 'premiumText' })
    const expectedText = [' ', i18n('match.discount', '2')]

    expect(textElement.props.children).toStrictEqual(expectedText)
  })
  it('should show text at market price', () => {
    const amount = 100000
    const matchMock = { amount, premium: 0 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    const textElement = testInstance.findByProps({ testID: 'premiumText' })
    const expectedText = [' ', i18n('match.atMarketPrice')]

    expect(textElement.props.children).toStrictEqual(expectedText)
  })
})
