import { renderHook } from 'test-utils'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { usePaymentMethodLabel } from './usePaymentMethodLabel'

describe('usePaymentMethodLabel', () => {
  it('should return a function', () => {
    const { result } = renderHook(usePaymentMethodLabel)
    expect(result.current).toBeInstanceOf(Function)
  })

  describe('getPaymentMethodLabel', () => {
    it('should return the correct label for a payment method with no existing methods', () => {
      const { result } = renderHook(usePaymentMethodLabel)
      const getPaymentMethodLabel = result.current
      expect(getPaymentMethodLabel('sepa')).toBe('SEPA')
    })

    it('should return the correct label for a payment method with existing methods', () => {
      usePaymentDataStore.getState().addPaymentData({
        id: '1',
        type: 'sepa',
        label: 'SEPA',
        currencies: ['EUR'],
      })
      const { result } = renderHook(usePaymentMethodLabel)
      const getPaymentMethodLabel = result.current
      expect(getPaymentMethodLabel('sepa')).toBe('SEPA #2')
    })
  })
})
