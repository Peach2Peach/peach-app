import { account1 } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { setAccount } from '../account'
import { setPeachWallet } from '../wallet/setWallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { getSellOfferIdFromContract } from './getSellOfferIdFromContract'
import { getWalletLabelFromContract } from './getWalletLabelFromContract'

jest.mock('../wallet/PeachWallet')

describe('getWalletLabelFromContract', () => {
  beforeAll(() => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), walletLabel: undefined }],
    })
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })
  it('should return "custom payout address" by default', () => {
    expect(
      getWalletLabelFromContract({
        contract,
        customPayoutAddress: undefined,
        customPayoutAddressLabel: undefined,
        isPeachWalletActive: true,
      }),
    ).toBe('custom payout address')
  })

  it('should return the wallet label from the sell offer', () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, walletLabel: 'walletLabel', id: getSellOfferIdFromContract(contract) }],
    })
    expect(
      getWalletLabelFromContract({
        contract,
        customPayoutAddress: undefined,
        customPayoutAddressLabel: undefined,
        isPeachWalletActive: true,
      }),
    ).toBe('walletLabel')
  })
})
