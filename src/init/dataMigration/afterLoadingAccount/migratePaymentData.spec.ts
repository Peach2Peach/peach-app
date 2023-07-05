import { paymentDetailInfo, twintData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { migratePaymentData } from './migratePaymentData'

describe('migratePaymentData', () => {
  const paymentData = [validSEPAData, twintData]
  afterEach(() => usePaymentDataStore.getState().reset())
  it('updates payment data by enforcing format', () => {
    migratePaymentData(paymentData)
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
    })
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual(paymentDetailInfo)
    expect(usePaymentDataStore.getState().migrated).toBeTruthy()
  })
  it('does nothing if already migrated', () => {
    usePaymentDataStore.getState().setMigrated()
    migratePaymentData(paymentData)
    expect(usePaymentDataStore.getState().paymentData).toEqual({})
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({})
  })
})
