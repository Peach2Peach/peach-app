import i18n from '../../../../src/utils/i18n'
import { getSummaryWalletLabel } from '../../../../src/utils/offer'

const findKeyPairByAddressMock = jest.fn().mockReturnValue(false)
jest.mock('../../../../src/utils/wallet/setWallet', () => ({
  peachWallet: {
    findKeyPairByAddress: (address: string) => findKeyPairByAddressMock(address),
  },
}))

describe('getSummaryWalletLabel', () => {
  it('should return offerWalletLabel if it is defined', () => {
    const offerWalletLabel = 'offerWalletLabel'
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getSummaryWalletLabel({
      offerWalletLabel,
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(offerWalletLabel)
  })

  it('should return peachWallet if address is in peachWallet', () => {
    const offerWalletLabel = undefined
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    findKeyPairByAddressMock.mockReturnValueOnce(true)

    const result = getSummaryWalletLabel({
      offerWalletLabel,
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(i18n('peachWallet'))
  })

  it('should return customPayoutAddressLabel if address is customPayoutAddress', () => {
    const offerWalletLabel = undefined
    const address = 'customPayoutAddress'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getSummaryWalletLabel({
      offerWalletLabel,
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(customPayoutAddressLabel)
  })

  it('should return undefined if address is not peachWallet or customPayoutAddress', () => {
    const offerWalletLabel = undefined
    const address = 'address'
    const customPayoutAddress = 'customPayoutAddress'
    const customPayoutAddressLabel = 'customPayoutAddressLabel'

    const result = getSummaryWalletLabel({
      offerWalletLabel,
      address,
      customPayoutAddress,
      customPayoutAddressLabel,
    })

    expect(result).toEqual(undefined)
  })
})
