import { account, updateAccount } from '../../../utils/account'
import { getPreferredMethods } from './getPreferredMethods'

describe('getPreferredMethods', () => {
  it('should return the expected object', () => {
    const ids = ['sepa-123456789', 'revolut-123456789']
    updateAccount({
      ...account,
      paymentData: [
        {
          id: 'sepa-123456789',
          iban: 'DE89370400440532013000',
          bic: 'COBADEFFXXX',
          label: 'SEPA',
          type: 'sepa',
          currencies: ['EUR'],
        },
        {
          id: 'revolut-123456789',
          label: 'Revolut',
          type: 'revolut',
          currencies: ['EUR'],
        },
        {
          id: 'paypal-123456789',
          label: 'PayPal',
          type: 'paypal',
          currencies: ['EUR'],
        },
      ],
    })

    const expected = {
      sepa: 'sepa-123456789',
      revolut: 'revolut-123456789',
    }
    expect(getPreferredMethods(ids)).toEqual(expected)
  })
})
