import { addPaymentDetailInfoByHash } from './addPaymentDetailInfoByHash'
import { paymentDetailInfo } from '../../../../tests/unit/data/paymentData'

describe('addPaymentDetailInfoByHash', () => {
  const emptyPaymentData: PaymentDataInfo = {}
  it('finds payment detail info by hash and adds it to the object', () => {
    expect(addPaymentDetailInfoByHash(paymentDetailInfo)(emptyPaymentData, 'phonehash')).toEqual({
      phone: paymentDetailInfo.phone?.phonehash,
    })
    expect(addPaymentDetailInfoByHash(paymentDetailInfo)(emptyPaymentData, 'emailhash')).toEqual({
      email: paymentDetailInfo.email?.emailhash,
    })
  })
  it('finds returns the object as is if hash could not be found', () => {
    expect(addPaymentDetailInfoByHash(paymentDetailInfo)(emptyPaymentData, 'otherhash')).toEqual(emptyPaymentData)
  })
})
