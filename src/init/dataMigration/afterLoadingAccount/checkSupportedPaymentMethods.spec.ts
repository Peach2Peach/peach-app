import { paypalData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { checkSupportedPaymentMethods } from './checkSupportedPaymentMethods'

const paymentInfo: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR'],
    anonymous: false,
  },
]

describe('checkSupportedPaymentMethods', () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(paypalData)
    useOfferPreferences.getState().setPaymentMethods([validSEPAData.id, paypalData.id])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets inactive flag on payment methods that are not supported', () => {
    const [method1, method2] = checkSupportedPaymentMethods(paymentInfo)
    expect(method1.hidden).toEqual(false)
    expect(method2.hidden).toEqual(true)
  })
  it('calls setPreferredPaymentMethods to update settings with new preferred methods', () => {
    const setPaymentMethodsSpy = jest.spyOn(useOfferPreferences.getState(), 'setPaymentMethods')

    checkSupportedPaymentMethods(paymentInfo)

    expect(setPaymentMethodsSpy).toHaveBeenCalledWith([validSEPAData.id])
  })
  it('calls updatePaymentData with new data', () => {
    checkSupportedPaymentMethods(paymentInfo)
    expect(usePaymentDataStore.getState().getPaymentDataArray()).toEqual([
      { ...validSEPAData, hidden: false },
      { ...paypalData, hidden: true },
    ])
  })
})
