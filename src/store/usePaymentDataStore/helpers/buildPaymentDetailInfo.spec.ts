import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { buildPaymentDetailInfo } from './buildPaymentDetailInfo'

describe('buildPaymentDetailInfo', () => {
  it('adds payment data', () => {
    expect(buildPaymentDetailInfo(validSEPAData)).toEqual({
      beneficiary: {
        '2b46d198979c80a25ee51ec0bb846f09b3b159e4e35893b666543c1094f009e8': 'Hal Finney',
      },
      iban: {
        '8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3': 'IE29 AIBK 9311 5212 3456 78',
      },
      bic: {
        d8b722319ca44fd92fcfc69ae913a8d5b03a4ba394ebd2fa2bf609a93c763dfd: 'AAAA BB CC 123',
      },
    })
  })
})
