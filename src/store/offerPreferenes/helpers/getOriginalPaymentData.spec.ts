import { account, updateAccount } from '../../../utils/account'
import { getOriginalPaymentData } from './getOriginalPaymentData'

describe('getOriginalPaymentData', () => {
  it('should return the expected object', () => {
    const mockData = {
      sepa: 'sepa-123456789',
    }
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
      ],
    })
    const expected = [
      {
        iban: 'DE89370400440532013000',
        bic: 'COBADEFFXXX',
        currencies: ['EUR'],
        id: 'sepa-123456789',
        label: 'SEPA',
        type: 'sepa',
      },
    ]
    expect(getOriginalPaymentData(mockData)).toEqual(expected)
  })
})
