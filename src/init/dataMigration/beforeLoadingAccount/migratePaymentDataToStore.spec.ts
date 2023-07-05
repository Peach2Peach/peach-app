import { paymentDetailInfo, twintData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { accountStorage } from '../../../utils/account/accountStorage'
import { migratePaymentDataToStore } from './migratePaymentDataToStore'

describe('migratePaymentDataToStore', () => {
  const paymentData = [validSEPAData, twintData]
  beforeAll(() => {
    accountStorage.setArray('paymentData', paymentData)
  })
  afterEach(() => usePaymentDataStore.getState().reset())

  it('updates payment data by enforcing format', () => {
    migratePaymentDataToStore()
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
    })
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual(paymentDetailInfo)
    expect(usePaymentDataStore.getState().migrated).toBeTruthy()
  })
  it('does nothing if already migrated', () => {
    usePaymentDataStore.getState().setMigrated()
    migratePaymentDataToStore()
    expect(usePaymentDataStore.getState().paymentData).toEqual({})
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({})
  })
})
