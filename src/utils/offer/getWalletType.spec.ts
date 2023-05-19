import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { getBuyOfferDraft, getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { getWalletType } from './getWalletType'

describe('getWalletType', () => {
  it('returns payout wallet for buy offers', () => {
    expect(getWalletType(buyOffer)).toBe('payout')
  })
  it('returns refund wallet for sell offers', () => {
    expect(getWalletType(sellOffer)).toBe('refund')
  })
  it('returns payout wallet for buy offer drafts', () => {
    expect(getWalletType(getBuyOfferDraft())).toBe('payout')
  })
  it('returns refund wallet for sell offer drafts', () => {
    expect(getWalletType(getSellOfferDraft())).toBe('refund')
  })
})
