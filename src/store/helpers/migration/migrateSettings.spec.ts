import { account, updateAccount } from '../../../utils/account'
import { useOfferPreferences } from '../../offerPreferenes'
import { defaultPreferences } from '../../offerPreferenes/useOfferPreferences'
import { migrateSettings } from './migrateSettings'

// eslint-disable-next-line max-lines-per-function
describe('migrateSettings', () => {
  beforeEach(() => {
    useOfferPreferences.setState(defaultPreferences)
  })
  it('should migrate from version 0', () => {
    const persistedState = {
      lastBackupDate: '2021-07-12T13:00:00.000Z',
      preferredPaymentMethods: { sepa: 'sepa-1234', revolut: 'revolut-1234' },
      premium: 1,
      minBuyAmount: 100,
      maxBuyAmount: 1000,
      sellAmount: 100,
    }
    updateAccount({
      ...account,
      paymentData: [
        {
          id: 'sepa-1234',
          iban: 'DE89370400440532013000',
          bic: 'COBADEFFXXX',
          label: 'SEPA',
          type: 'sepa',
          currencies: ['EUR'],
        },
      ],
    })
    const migratedState = migrateSettings(persistedState, 0)
    expect(migratedState).toEqual({
      lastFileBackupDate: '2021-07-12T13:00:00.000Z',
    })
    expect(useOfferPreferences.getState()).toEqual(
      expect.objectContaining({
        buyAmountRange: [100, 1000],
        meansOfPayment: {
          EUR: ['sepa'],
        },
        originalPaymentData: [
          {
            bic: 'COBADEFFXXX',
            currencies: ['EUR'],
            iban: 'DE89370400440532013000',
            id: 'sepa-1234',
            label: 'SEPA',
            type: 'sepa',
          },
        ],
        paymentData: {
          sepa: {
            country: undefined,
            hash: '94c30c03991f2923fae94566e32d9171e59ba045eea4c0607b4dbe17edfbf74e',
          },
        },
        preferredPaymentMethods: {
          sepa: 'sepa-1234',
        },
        premium: 1,
        sellAmount: 100,
      }),
    )
  })

  it('should migrate from version 1', () => {
    const persistedState = {
      preferredPaymentMethods: { sepa: 'sepa-1234', revolut: 'revolut-1234' },
      premium: 1,
      minBuyAmount: 100,
      maxBuyAmount: 1000,
      sellAmount: 100,
    }
    updateAccount({
      ...account,
      paymentData: [
        {
          id: 'sepa-1234',
          iban: 'DE89370400440532013000',
          bic: 'COBADEFFXXX',
          label: 'SEPA',
          type: 'sepa',
          currencies: ['EUR'],
        },
      ],
    })
    const migratedState = migrateSettings(persistedState, 1)
    expect(migratedState).toEqual({
      lastFileBackupDate: undefined,
    })
    expect(useOfferPreferences.getState()).toEqual(
      expect.objectContaining({
        buyAmountRange: [100, 1000],
        meansOfPayment: {
          EUR: ['sepa'],
        },
        originalPaymentData: [
          {
            bic: 'COBADEFFXXX',
            currencies: ['EUR'],
            iban: 'DE89370400440532013000',
            id: 'sepa-1234',
            label: 'SEPA',
            type: 'sepa',
          },
        ],
        paymentData: {
          sepa: {
            country: undefined,
            hash: '94c30c03991f2923fae94566e32d9171e59ba045eea4c0607b4dbe17edfbf74e',
          },
        },
        preferredPaymentMethods: {
          sepa: 'sepa-1234',
        },
        premium: 1,
        sellAmount: 100,
      }),
    )
  })
})
