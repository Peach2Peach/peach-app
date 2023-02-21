// eslint-disable-next-line max-len
import { checkSupportedPaymentMethods } from '../../../../../src/init/dataMigration/afterLoadingAccount/checkSupportedPaymentMethods'
import { settingsStore } from '../../../../../src/store/settingsStore'
import { updatePaymentData } from '../../../../../src/utils/account/updatePaymentData'

jest.mock('../../../../../src/utils/account/updatePaymentData', () => ({
  updatePaymentData: jest.fn(),
}))

const paymentData: PaymentData[] = [
  {
    id: 'sepa-1069850495',
    beneficiary: 'Melocoton',
    iban: 'IE29 AIBK 9311 5212 3456 78',
    label: 'Bank Account Ireland',
    selected: true,
    type: 'sepa',
    currencies: ['EUR'],
  },
  {
    id: 'paypal-1095805944',
    phone: '+412134245',
    label: 'Paypal',
    type: 'paypal',
    currencies: ['EUR'],
  },
]

const paymentInfo: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR'],
    anonymous: false,
  },
]

describe('checkSupportedPaymentMethods', () => {
  beforeEach(() => {
    settingsStore.getState().setPreferredPaymentMethods({
      sepa: 'sepa-1069850495',
      paypal: 'paypal-1095805944',
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets inactive flag on payment methods that are not supported', () => {
    const [method1, method2] = checkSupportedPaymentMethods(paymentData, paymentInfo)
    expect(method1.hidden).toEqual(false)
    expect(method2.hidden).toEqual(true)
  })
  it('sets calls setPreferredPaymentMethods to update settings with new preferred methods', () => {
    const setSpy = jest.spyOn(settingsStore.getState(), 'setPreferredPaymentMethods')

    checkSupportedPaymentMethods(paymentData, paymentInfo)
    expect(setSpy).toHaveBeenCalledWith({
      sepa: 'sepa-1069850495',
    })
  })
  it('calls updatePaymentData with new data', () => {
    checkSupportedPaymentMethods(paymentData, paymentInfo)
    expect(updatePaymentData).toHaveBeenCalledWith([
      {
        id: 'sepa-1069850495',
        beneficiary: 'Melocoton',
        iban: 'IE29 AIBK 9311 5212 3456 78',
        label: 'Bank Account Ireland',
        selected: true,
        type: 'sepa',
        currencies: ['EUR'],
        hidden: false,
      },
      {
        id: 'paypal-1095805944',
        phone: '+412134245',
        label: 'Paypal',
        type: 'paypal',
        currencies: ['EUR'],
        hidden: true,
      },
    ])
  })
})
