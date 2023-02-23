// eslint-disable-next-line max-len
import { enforcePaymentDataFormats } from '../../../../../src/init/dataMigration/afterLoadingAccount/enforcePaymentDataFormats'
import { updatePaymentData } from '../../../../../src/utils/account'

jest.mock('../../../../../src/utils/account/updatePaymentData', () => ({
  updatePaymentData: jest.fn(),
}))

const legacyPaymentData: PaymentData[] = [
  {
    id: 'sepa-1069850495',
    beneficiary: 'Melocoton',
    iban: 'ie29aibk93115212345678',
    label: 'Bank Account Ireland',
    selected: true,
    type: 'sepa',
    currencies: ['EUR'],
  },
  {
    id: 'paypal-1095805944',
    phone: '412134245',
    label: 'Paypal',
    type: 'paypal',
    currencies: ['EUR'],
  },
]

const expectedPaymentData: PaymentData[] = [
  {
    id: 'sepa-1069850495',
    version: '0.2.0',
    beneficiary: 'Melocoton',
    iban: 'IE29 AIBK 9311 5212 3456 78',
    label: 'Bank Account Ireland',
    selected: true,
    type: 'sepa',
    currencies: ['EUR'],
  },
  {
    id: 'paypal-1095805944',
    version: '0.2.0',
    phone: '+412134245',
    label: 'Paypal',
    type: 'paypal',
    currencies: ['EUR'],
  },
]

describe('enforcePaymentDataFormats', () => {
  it('updates payment data by enforcing format', () => {
    enforcePaymentDataFormats(legacyPaymentData)
    expect(updatePaymentData).toHaveBeenCalledWith(expectedPaymentData)
  })
})
