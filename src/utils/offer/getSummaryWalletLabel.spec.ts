/* eslint-disable max-lines-per-function */
import i18n from '../i18n'
import { getSummaryWalletLabel } from '.'

const findKeyPairByAddressMock = jest.fn().mockReturnValue(false)
jest.mock('../wallet/setWallet', () => ({
  peachWallet: {
    findKeyPairByAddress: (address: string) => findKeyPairByAddressMock(address),
  },
}))

describe('getSummaryWalletLabel', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return customPayoutAddressLabel if address is customPayoutAddress', () => {
    const address = 'customPayoutAddress'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getSummaryWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(customPayoutAddressLabel)
  })

  it('should return peachWallet if address is in peachWallet', () => {
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    findKeyPairByAddressMock.mockReturnValueOnce(true)

    const result = getSummaryWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(i18n('peachWallet'))
  })

  it('should return customPayoutAddressLabel even if address is in peachWallet', () => {
    const address = 'customPayoutAddress'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    findKeyPairByAddressMock.mockReturnValueOnce(true)

    const result = getSummaryWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(customPayoutAddressLabel)
  })

  it('should return undefined if address is not peachWallet or customPayoutAddress', () => {
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getSummaryWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(undefined)
  })
  it('should return undefined if no address is passed', () => {
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getSummaryWalletLabel({
      address: undefined,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(undefined)
  })
})
