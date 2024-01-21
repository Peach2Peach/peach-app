import { contract } from '../../../peach-api/src/testData/contract'
import { account1 } from '../../../tests/unit/data/accountData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { setAccount } from '../account/account'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'
import { getSellOfferIdFromContract } from './getSellOfferIdFromContract'
import { getWalletLabelFromContract } from './getWalletLabelFromContract'

jest.mock('../wallet/PeachWallet')

describe('getWalletLabelFromContract', () => {
  beforeAll(() => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), walletLabel: undefined }],
    })
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }))
  })
  it('should return "custom payout address" by default', () => {
    expect(
      getWalletLabelFromContract({
        contract,
        customAddress: undefined,
        customAddressLabel: undefined,
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
        customAddress: undefined,
        customAddressLabel: undefined,
        isPeachWalletActive: true,
      }),
    ).toBe('walletLabel')
  })
})
