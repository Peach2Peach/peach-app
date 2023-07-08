import { paymentDetailInfo, twintData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { accountStorage } from '../../../utils/account/accountStorage'
import { migratePaymentDataToStore } from './migratePaymentDataToStore'

describe('migratePaymentDataToStore', () => {
  const paymentData = [validSEPAData, twintData]
  beforeEach(() => {
    accountStorage.setArray('paymentData', paymentData)
  })
  afterEach(() => usePaymentDataStore.getState().reset())

  it('migrates payment data from account to paymentDataStore', () => {
    migratePaymentDataToStore()
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
    })
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual(paymentDetailInfo)
    expect(usePaymentDataStore.getState().migrated).toBeTruthy()
  })
  it('migrates even if already migrated', () => {
    usePaymentDataStore.getState().setMigrated()
    migratePaymentDataToStore()
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
    })
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual(paymentDetailInfo)
    expect(usePaymentDataStore.getState().migrated).toBeTruthy()
  })
  it('removes paymentData from account', () => {
    migratePaymentDataToStore()
    expect(accountStorage.getArray('paymentData')).toBeUndefined()
  })
})
