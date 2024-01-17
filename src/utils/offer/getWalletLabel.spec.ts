import i18n from '../i18n'
import { getWalletLabel } from './getWalletLabel'

const findKeyPairByAddressMock = jest.fn().mockReturnValue(false)
jest.mock('../wallet/setWallet', () => ({
  peachWallet: {
    findKeyPairByAddress: (address: string) => findKeyPairByAddressMock(address),
  },
}))

describe('getWalletLabel', () => {
  const customAddress = 'customPayoutAddress'
  const customAddressLabel = 'customPayoutAddressLabel'
  it('should return customPayoutAddressLabel if address is customPayoutAddress', () => {
    const result = getWalletLabel({
      address: customAddress,
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    })
    expect(findKeyPairByAddressMock).not.toHaveBeenCalled()

    expect(result).toEqual(customAddressLabel)
  })

  it('should return peachWallet if address is in peachWallet', () => {
    findKeyPairByAddressMock.mockReturnValueOnce(true)
    const result = getWalletLabel({
      address: 'address',
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual(i18n('peachWallet'))
  })

  it('should return "custom payout address" if address is not peachWallet or customPayoutAddress', () => {
    const result = getWalletLabel({
      address: 'address',
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual('custom payout address')
  })
  it('should return "custom payout address" if no address is passed', () => {
    const result = getWalletLabel({
      address: undefined,
      customAddress,
      customAddressLabel,
      isPeachWalletActive: true,
    })

    expect(result).toEqual('custom payout address')
  })
  it('returns "custom payout address" if no customPayoutAddressLabel but the address is the customPayoutAddress', () => {
    const result = getWalletLabel({
      address: customAddress,
      customAddress,
      customAddressLabel: undefined,
      isPeachWalletActive: true,
    })

    expect(result).toEqual('custom payout address')
  })
  it('returns "custom payout address" if the peach wallet is not active', () => {
    const result = getWalletLabel({
      address: 'address',
      customAddress: undefined,
      customAddressLabel: undefined,
      isPeachWalletActive: false,
    })

    expect(result).toEqual('custom payout address')
  })
})
