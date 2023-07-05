import { twintData, validSEPAData } from '../../../tests/unit/data/paymentData'
import { hashPaymentData } from './hashPaymentData'

describe('hashPaymentData', () => {
  it('should hash every relevant payment data field', () => {
    expect(hashPaymentData(validSEPAData)).toEqual([
      {
        field: 'beneficiary',
        value: 'Hal Finney',
        hash: '2b46d198979c80a25ee51ec0bb846f09b3b159e4e35893b666543c1094f009e8',
      },
      {
        field: 'bic',
        value: 'AAAA BB CC 123',
        hash: 'd8b722319ca44fd92fcfc69ae913a8d5b03a4ba394ebd2fa2bf609a93c763dfd',
      },
      {
        field: 'iban',
        value: 'IE29 AIBK 9311 5212 3456 78',
        hash: '8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3',
      },
    ])
    expect(hashPaymentData(twintData)).toEqual([
      {
        field: 'phone',
        value: '+341234875987',
        hash: 'c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b418',
      },
    ])
  })
  it('does not hash irrelevant data', () => {
    expect(hashPaymentData({ id: 'test', label: 'label', type: 'sepa', currencies: ['EUR'] })).toEqual([])
  })
})
