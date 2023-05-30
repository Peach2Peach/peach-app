/* eslint-disable max-lines-per-function */
import { enforceFormatOnPaymentData } from '.'

describe('enforceFormatOnPaymentData', () => {
  it('should enforce format on sepa data correctly', () => {
    const data: PaymentData = {
      id: 'sepa-1',
      label: 'Sepa',
      type: 'sepa',
      currencies: ['EUR'],
      beneficiary: 'Hal Finney',
      iban: 'ie29aibk93115212345678',
      bic: 'aaaabbcc123',
      reference: 'Some reference',
    }
    const expected: PaymentData = {
      id: 'sepa-1',
      version: '0.2.0',
      label: 'Sepa',
      type: 'sepa',
      currencies: ['EUR'],
      beneficiary: 'Hal Finney',
      iban: 'IE29 AIBK 9311 5212 3456 78',
      bic: 'AAAA BB CC 123',
      reference: 'Some reference',
    }
    expect(enforceFormatOnPaymentData(data)).toEqual(expected)
  })
  it('should enforce format on payment data with phone, email, username correctly', () => {
    const data: PaymentData = {
      id: 'paypal-1',
      label: 'Paypal',
      type: 'paypal',
      currencies: ['EUR'],
      phone: '12345678',
      email: 'sATOSHI@gmx.at',
      userName: 'Satoshi',
    }
    const expected: PaymentData = {
      id: 'paypal-1',
      version: '0.2.0',
      label: 'Paypal',
      type: 'paypal',
      currencies: ['EUR'],
      phone: '+12345678',
      email: 'satoshi@gmx.at',
      userName: '@satoshi',
    }
    expect(enforceFormatOnPaymentData(data)).toEqual(expected)
  })

  it('should skip enforce on data with latest version', () => {
    const data: PaymentData = {
      id: 'sepa-1',
      version: '0.2.0',
      label: 'Sepa',
      type: 'sepa',
      currencies: ['EUR'],
      beneficiary: 'Hal Finney',
      iban: 'IE29 AIBK 9311 5212 345678', // purposefully having wrong format here for check
    }
    expect(enforceFormatOnPaymentData(data)).toEqual(data)
  })
})
