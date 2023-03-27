// eslint-disable-next-line max-len

import { getNewPreferredPaymentMethods } from '.'

const paymentData: PaymentData[] = [
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
]

describe('getNewPreferredPaymentMethods', () => {
  it('returns new preferred payment methods based on hidden flag', () => {
    const preferredPaymentMethods = {
      sepa: 'sepa-1069850495',
      paypal: 'paypal-1095805944',
    }
    expect(getNewPreferredPaymentMethods(preferredPaymentMethods, paymentData)).toEqual({
      sepa: 'sepa-1069850495',
    })
  })
})
