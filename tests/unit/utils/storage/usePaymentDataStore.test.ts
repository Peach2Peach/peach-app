import { deepStrictEqual } from 'assert'
import { usePaymentDataStore } from '../../../../src/utils/storage/paymentDataStorage'
import * as accountData from '../../data/accountData'

describe('usePaymentDataStore', () => {
  const paymentData = usePaymentDataStore()

  it('adds new payment data to account', () => {
    paymentData.setPaymentData(accountData.paymentData[0])
    paymentData.setPaymentData(accountData.paymentData[1])
    deepStrictEqual(paymentData, accountData.paymentData)
  })
  it('updates payment data on account', () => {
    paymentData.setPaymentData({
      ...accountData.paymentData[1],
      beneficiary: 'Hal',
    })
    deepStrictEqual(paymentData.paymentData['sepa-1095805944'].beneficiary, 'Hal')
  })
})
