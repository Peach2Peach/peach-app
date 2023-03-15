import { account1 } from '../../../../tests/unit/data/accountData'
import { updatePaymentData } from '../../../utils/account'
import { enforcePaymentDataFormats } from './enforcePaymentDataFormats'

jest.mock('../../../utils/account', () => ({
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
    enforcePaymentDataFormats(account1, legacyPaymentData)
    expect(updatePaymentData).toHaveBeenCalledWith(expectedPaymentData)
  })
})
