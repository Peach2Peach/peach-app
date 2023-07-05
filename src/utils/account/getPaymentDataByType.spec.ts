import { paypalData, validSEPAData, validSEPAData2 } from '../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { getPaymentDataByType } from './getPaymentDataByType'

describe('getPaymentDataByType', () => {
  it('should return all payment data by type', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(validSEPAData2)
    usePaymentDataStore.getState().addPaymentData(paypalData)

    expect(getPaymentDataByType('sepa')).toEqual([validSEPAData, validSEPAData2])
    expect(getPaymentDataByType('paypal')).toEqual([paypalData])
  })
})
