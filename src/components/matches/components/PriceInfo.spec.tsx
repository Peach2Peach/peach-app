import React from 'react'
import { View } from 'react-native'
import { create } from 'react-test-renderer'
import i18n from '../../../utils/i18n'
import { SatsFormat } from '../../text'
import { PriceInfo } from './PriceInfo'

const useConfigStoreMock = jest.fn()

jest.mock('../../../store/configStore', () => ({
  useConfigStore: (selector) => useConfigStoreMock(selector),
}))

jest.mock('../Price', () => ({
  Price: () => <View />,
}))

describe('PriceInfo', () => {
  it('should exclude peach fee from sats', () => {
    const peachFee = 0.02
    useConfigStoreMock.mockImplementationOnce((selector) => selector({ peachFee }))
    const amount = 210000
    const matchMock = { amount, premium: 7 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    expect(testInstance.findByType(SatsFormat).props.sats).toBe(amount * (1 - peachFee))
  })
  it('should show text corresponding to the premium with the fee included for premiums', () => {
    const peachFee = 0.02

    useConfigStoreMock.mockImplementationOnce((selector) => selector({ peachFee }))
    const amount = 100000
    const matchMock = { amount, premium: 7 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    const textElement = testInstance.findByProps({ testID: 'premiumText' })
    const expectedText = [' ', i18n('match.premium', '9')]

    expect(textElement.props.children).toStrictEqual(expectedText)
  })
  it('should show text corresponding to the premium with the fee included for discounts', () => {
    const peachFee = 0.02

    useConfigStoreMock.mockImplementationOnce((selector) => selector({ peachFee }))
    const amount = 100000
    const matchMock = { amount, premium: -7 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    const textElement = testInstance.findByProps({ testID: 'premiumText' })
    const expectedText = [' ', i18n('match.discount', '5')]

    expect(textElement.props.children).toStrictEqual(expectedText)
  })

  it('should show text corresponding to the premium with the fee included for at market price', () => {
    const peachFee = 0.02

    useConfigStoreMock.mockImplementationOnce((selector) => selector({ peachFee }))
    const amount = 100000
    const matchMock = { amount, premium: -2 } as Match
    const offerMock = {} as BuyOffer

    const testInstance = create(<PriceInfo match={matchMock} offer={offerMock} />).root

    const textElement = testInstance.findByProps({ testID: 'premiumText' })
    const expectedText = [' ', i18n('match.atMarketPrice')]

    expect(textElement.props.children).toStrictEqual(expectedText)
  })
})
