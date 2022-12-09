import { ok } from 'assert'
import { isKYCConfirmationRequired } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'
import { buyOffer, sellOffer } from '../../../data/offerData'

describe('isKYCConfirmationRequired', () => {
  it('should check if KYC needs to be confirmed', () => {
    ok(
      isKYCConfirmationRequired(sellOffer, {
        ...contract,
        kycRequired: true,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCConfirmationRequired(sellOffer, {
        ...contract,
        kycRequired: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCConfirmationRequired(sellOffer, {
        ...contract,
        kycRequired: true,
        kycResponseDate: new Date(),
      }),
    )
    ok(
      !isKYCConfirmationRequired(buyOffer as Offer as SellOffer, {
        ...contract,
        kycRequired: true,
        kycResponseDate: null,
      }),
    )
  })
})
