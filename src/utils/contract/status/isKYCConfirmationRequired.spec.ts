import { ok } from 'assert'
import { isKYCConfirmationRequired } from '.'
import { contract } from '../../../../tests/unit/data/contractData'

describe('isKYCConfirmationRequired', () => {
  it('should check if KYC needs to be confirmed', () => {
    ok(
      isKYCConfirmationRequired({
        ...contract,
        kycRequired: true,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCConfirmationRequired({
        ...contract,
        kycRequired: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCConfirmationRequired({
        ...contract,
        kycRequired: true,
        kycResponseDate: new Date(),
      }),
    )
  })
})
