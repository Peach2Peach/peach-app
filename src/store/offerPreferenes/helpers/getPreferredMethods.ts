import { usePaymentDataStore } from '../../usePaymentDataStore'
import { OfferPreferences } from '../useOfferPreferences'

export const getPreferredMethods = (ids: string[]): OfferPreferences['preferredPaymentMethods'] =>
  ids.reduce((obj, id) => {
    const method = usePaymentDataStore
      .getState()
      .getPaymentDataArray()
      .find((data) => data.id === id)?.type
    if (method) return { ...obj, [method]: id }
    return obj
  }, {})
