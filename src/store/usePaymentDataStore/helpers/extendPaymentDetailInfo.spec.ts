import { PaymentDataHashInfo } from '../../../utils/paymentMethod/hashPaymentData'
import { PaymentDetailInfo } from '../types'
import { extendPaymentDetailInfo } from './extendPaymentDetailInfo'

describe('extendPaymentDetailInfo', () => {
  const emptyObject: PaymentDetailInfo = {}
  const hashInfo: PaymentDataHashInfo = {
    field: 'beneficiary',
    value: 'Hal Finney',
    hash: '2b46d198979c80a25ee51ec0bb846f09b3b159e4e35893b666543c1094f009e8',
  }
  it('adds payment data', () => {
    expect(extendPaymentDetailInfo(emptyObject, hashInfo)).toEqual({
      beneficiary: {
        '2b46d198979c80a25ee51ec0bb846f09b3b159e4e35893b666543c1094f009e8': 'Hal Finney',
      },
    })
  })
})
