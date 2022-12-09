import { ok } from 'assert'
import { isKYCRequired } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'
import { buyOffer, sellOffer } from '../../../data/offerData'

describe('isKYCRequired', () => {
  it('should check if sending KYC info is required', () => {
    ok(
      isKYCRequired(buyOffer, {
        ...contract,
        kycRequired: true,
        kycConfirmed: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCRequired(buyOffer, {
        ...contract,
        kycRequired: false,
        kycConfirmed: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCRequired(buyOffer, {
        ...contract,
        kycRequired: true,
        kycConfirmed: true,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCRequired(buyOffer, {
        ...contract,
        kycRequired: true,
        kycConfirmed: true,
        kycResponseDate: new Date(),
      }),
    )
    ok(
      !isKYCRequired(sellOffer as Offer as BuyOffer, {
        ...contract,
        kycRequired: true,
        kycConfirmed: false,
        kycResponseDate: null,
      }),
    )
  })
})
