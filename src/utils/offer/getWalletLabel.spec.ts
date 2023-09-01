/* eslint-disable max-lines-per-function */
import i18n from '../i18n'
import { getWalletLabel } from './getWalletLabel'

const findKeyPairByAddressMock = jest.fn().mockReturnValue(false)
jest.mock('../wallet/setWallet', () => ({
  peachWallet: {
    findKeyPairByAddress: (address: string) => findKeyPairByAddressMock(address),
  },
}))

describe('getWalletLabel', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return customPayoutAddressLabel if address is customPayoutAddress', () => {
    const address = 'customPayoutAddress'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual(customPayoutAddressLabel)
  })

  it('should return peachWallet if address is in peachWallet', () => {
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    findKeyPairByAddressMock.mockReturnValueOnce(true)

    const result = getWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual(i18n('peachWallet'))
  })

  it('should return customPayoutAddressLabel even if address is in peachWallet', () => {
    const address = 'customPayoutAddress'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    findKeyPairByAddressMock.mockReturnValueOnce(true)

    const result = getWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual(customPayoutAddressLabel)
  })

  it('should return "custom payout address" if address is not peachWallet or customPayoutAddress', () => {
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual('custom payout address')
  })
  it('should return "custom payout address" if no address is passed', () => {
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getWalletLabel({
      address: undefined,
      customPayoutAddress,
      customPayoutAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual('custom payout address')
  })
  it('returns "custom payout address" if no customPayoutAddressLabel but the address is the customPayoutAddress', () => {
    const address = 'customPayoutAddress'
    const customPayoutAddress = 'customPayoutAddress'

    const result = getWalletLabel({
      address,
      customPayoutAddress,
      customPayoutAddressLabel: undefined,
      isPeachWalletActive: true,
    })

    expect(result).toEqual('custom payout address')
  })
  it('returns "custom payout address" if the peach wallet is not active', () => {
    const result = getWalletLabel({
      address: 'address',
      customPayoutAddress: undefined,
      customPayoutAddressLabel: undefined,
      isPeachWalletActive: false,
    })

    expect(result).toEqual('custom payout address')
  })
})
