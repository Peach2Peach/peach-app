import { sellOffer } from '../../../tests/unit/data/offerData'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { getEscrowWalletForOffer } from './getEscrowWalletForOffer'
import { setWallet } from './setWallet'

describe('getEscrowWalletForOffer', () => {
  const recoveredWallet = createTestWallet()
  const offer = { ...sellOffer, publicKey: '02d75a3c2af3a241fbd75bd5022e5effa040eca8e4b90142a4fb9aafca19f798e0' }
  const legacyOffer = { ...sellOffer, publicKey: '03ba98acb24b147963a060dec5caa2c1a987128bd95234d8c0064208abf28f3a1e' }
  beforeEach(() => {
    setWallet(recoveredWallet)
  })
  it('returns wallet for escrow of offer', () => {
    const wallet = getEscrowWalletForOffer(offer)
    expect(wallet.publicKey.toString('hex')).toBe('02d75a3c2af3a241fbd75bd5022e5effa040eca8e4b90142a4fb9aafca19f798e0')
  })
  it('returns legacy wallet for escrow of offer that used old derivation path', () => {
    const wallet = getEscrowWalletForOffer(legacyOffer)
    expect(wallet.publicKey.toString('hex')).toBe('03ba98acb24b147963a060dec5caa2c1a987128bd95234d8c0064208abf28f3a1e')
  })
})
