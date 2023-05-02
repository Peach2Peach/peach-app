import { getEscrowWalletForOffer, setWallet } from '.'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'

describe('getEscrowWalletForOffer', () => {
  const recoveredWallet = createTestWallet()

  beforeEach(() => {
    setWallet(recoveredWallet)
  })
  it('returns wallet for escrow depending on offer id', () => {
    const wallet = getEscrowWalletForOffer(sellOffer)
    expect(wallet.publicKey.toString('hex')).toBe('02d75a3c2af3a241fbd75bd5022e5effa040eca8e4b90142a4fb9aafca19f798e0')
  })
})
