import { paypalData, validSEPAData, validSEPAData2 } from '../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { getPaymentDataByLabel } from './getPaymentDataByLabel'

describe('getPaymentDataByLabel', () => {
  it('should return all payment data by label', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(validSEPAData2)
    usePaymentDataStore.getState().addPaymentData(paypalData)

    expect(getPaymentDataByLabel(validSEPAData.label)).toEqual(validSEPAData)
    expect(getPaymentDataByLabel(paypalData.label)).toEqual(paypalData)
  })
})
