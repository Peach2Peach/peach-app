/* eslint-disable max-lines-per-function */
import { removePaymentData } from '.'
import { twintData, validSEPAData, validSEPAData2, validSEPADataHashes } from '../../../tests/unit/data/paymentData'
import { apiSuccess } from '../../../tests/unit/data/peachAPIData'
import { NoErrorThrownError, getError } from '../../../tests/unit/helpers/getError'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'

const deletePaymentHashMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../peachAPI', () => ({
  deletePaymentHash: (...args: unknown[]) => deletePaymentHashMock(...args),
}))

describe('removePaymentData', () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(validSEPAData2)
    usePaymentDataStore.getState().addPaymentData(twintData)
    useOfferPreferences.getState().setPaymentMethods([])
  })

  it('does nothing if payment data does not exist', async () => {
    const removePaymentDataSpy = jest.spyOn(usePaymentDataStore.getState(), 'removePaymentData')
    await removePaymentData('nonExisting')
    expect(removePaymentDataSpy).not.toHaveBeenCalled()
  })
  it('removes payment data from account', async () => {
    await removePaymentData(validSEPAData.id)
    expect(usePaymentDataStore.getState().getPaymentDataArray()).toEqual([validSEPAData2, twintData])
    expect(deletePaymentHashMock).toHaveBeenCalledWith({ hashes: validSEPADataHashes })
  })
  it('updates the offerPreferences state if method was not preferred', () => {
    useOfferPreferences.getState().setPaymentMethods([validSEPAData2.id])
    removePaymentData(validSEPAData.id)
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({ sepa: validSEPAData2.id })
  })
  it('replaces payment method from preferred payment methods if set and fallback exists', async () => {
    useOfferPreferences.getState().setPaymentMethods([validSEPAData.id])
    await removePaymentData(validSEPAData.id)
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({
      sepa: validSEPAData2.id,
    })
  })
  it('removes payment method from preferred payment methods if set and no fallback exists', async () => {
    useOfferPreferences.getState().setPaymentMethods([validSEPAData.id])
    await removePaymentData(validSEPAData.id)
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({ sepa: validSEPAData2.id })
    await removePaymentData(validSEPAData2.id)
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({})
  })

  it('does not remove payment data if there is an unexpected error from server request', async () => {
    deletePaymentHashMock.mockResolvedValueOnce([null, { error: 'UNEXPECTED' }])
    const error = await getError<Error>(() => removePaymentData(validSEPAData.id))
    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error.message).toBe('NETWORK_ERROR')
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).toEqual(validSEPAData)

    deletePaymentHashMock.mockResolvedValueOnce([null, null])
    const error2 = await getError<Error>(() => removePaymentData(validSEPAData.id))
    expect(error2).not.toBeInstanceOf(NoErrorThrownError)
    expect(error2.message).toBe('NETWORK_ERROR')
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).toEqual(validSEPAData)
  })

  it('removes payment data from account if server error is expected', async () => {
    deletePaymentHashMock.mockResolvedValueOnce([null, { error: 'UNAUTHORIZED' }])
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).not.toBeUndefined()
    await removePaymentData(validSEPAData.id)
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).toBeUndefined()

    deletePaymentHashMock.mockResolvedValueOnce([null, { error: 'AUTHENTICATION_FAILED' }])
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData2.id)).not.toBeUndefined()
    await removePaymentData(validSEPAData2.id)
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData2.id)).toBeUndefined()
  })
})
