import { ok } from 'assert'
import { isKYCRequired } from '.'
import { contract } from '../../../../tests/unit/data/contractData'

describe('isKYCRequired', () => {
  it('should check if sending KYC info is required', () => {
    ok(
      isKYCRequired({
        ...contract,
        kycRequired: true,
        kycConfirmed: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCRequired({
        ...contract,
        kycRequired: false,
        kycConfirmed: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCRequired({
        ...contract,
        kycRequired: true,
        kycConfirmed: true,
        kycResponseDate: null,
      }),
    )
    ok(
      !isKYCRequired({
        ...contract,
        kycRequired: true,
        kycConfirmed: true,
        kycResponseDate: new Date(),
      }),
    )
  })
})
