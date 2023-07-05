/* eslint-disable max-lines-per-function, max-lines */
import { setPaymentMethods } from '../../constants'
import { account, updateAccount } from '../../utils/account'
import { useOfferPreferences } from './useOfferPreferences'

describe('useOfferPreferences - store', () => {
  it('should return a store', () => {
    expect(useOfferPreferences).toBeDefined()
  })
  it('should have the correct default values', () => {
    expect(useOfferPreferences.getState()).toStrictEqual({
      buyAmountRange: [0, Infinity],
      sellAmount: 0,
      preferredCurrenyType: 'europe',
      preferredPaymentMethods: {},
      meansOfPayment: {},
      paymentData: {},
      originalPaymentData: [],
      premium: 1.5,
      canContinue: {
        buyAmountRange: false,
        paymentMethods: false,
        premium: false,
        sellAmount: false,
      },
      setBuyAmountRange: expect.any(Function),
      setSellAmount: expect.any(Function),
      setPreferredCurrencyType: expect.any(Function),
      setPremium: expect.any(Function),
      setPaymentMethods: expect.any(Function),
      selectPaymentMethod: expect.any(Function),
    })
  })
  it('should persist the store', () => {
    expect(useOfferPreferences.persist.getOptions()).toStrictEqual(
      expect.objectContaining({
        name: 'offerPreferences',
        version: expect.any(Number),
        storage: expect.any(Object),
      }),
    )
  })
})

describe('useOfferPreferences - actions - setBuyAmountRange', () => {
  it('should update the buy amount range', () => {
    const newRange: [number, number] = [50000, 3200000]
    useOfferPreferences.getState().setBuyAmountRange(newRange, { min: 0, max: Infinity })
    expect(useOfferPreferences.getState().buyAmountRange).toStrictEqual(newRange)
  })
  it('should set can continue to false if the range is not valid', () => {
    const newRange: [number, number] = [50000, 3200000]
    useOfferPreferences.getState().setBuyAmountRange(newRange, { min: 0, max: 1000 })
    expect(useOfferPreferences.getState().canContinue.buyAmountRange).toBe(false)
  })
  it('should set can continue to true if the range is valid', () => {
    const newRange: [number, number] = [50000, 3200000]
    useOfferPreferences.getState().setBuyAmountRange(newRange, { min: 0, max: Infinity })
    expect(useOfferPreferences.getState().canContinue.buyAmountRange).toBe(true)
  })
})

describe('useOfferPreferences - actions - setSellAmount', () => {
  it('should update the sell amount', () => {
    const newSellAmount = 50000
    useOfferPreferences.getState().setSellAmount(newSellAmount, { min: 0, max: Infinity })
    expect(useOfferPreferences.getState().sellAmount).toBe(newSellAmount)
  })
  it('should set can continue to false if the sell amount is not valid', () => {
    const newSellAmount = 50000
    useOfferPreferences.getState().setSellAmount(newSellAmount, { min: 0, max: 1000 })
    expect(useOfferPreferences.getState().canContinue.sellAmount).toBe(false)
  })
  it('should set can continue to true if the sell amount is valid', () => {
    const newSellAmount = 50000
    useOfferPreferences.getState().setSellAmount(newSellAmount, { min: 0, max: Infinity })
    expect(useOfferPreferences.getState().canContinue.sellAmount).toBe(true)
  })
})

describe('useOfferPreferences - actions - setPremium', () => {
  it('should update the premium', () => {
    const newPremium = 21
    useOfferPreferences.getState().setPremium(newPremium)
    expect(useOfferPreferences.getState().premium).toBe(newPremium)
  })
  it('should set can continue to false if the premium is not valid', () => {
    const newPremium = 21
    useOfferPreferences.getState().setPremium(newPremium, false)
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
  })
  it('should set can continue to true if the premium is valid', () => {
    const newPremium = 21
    useOfferPreferences.getState().setPremium(newPremium, true)
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
  })
  it('should not overwrite canContinue if no isValid is passed', () => {
    const newPremium = 21
    useOfferPreferences.getState().setPremium(newPremium, false)
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
    useOfferPreferences.getState().setPremium(newPremium)
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
    useOfferPreferences.getState().setPremium(newPremium, true)
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
    useOfferPreferences.getState().setPremium(newPremium)
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
  })
})

describe('useOfferPreferences - actions - setPaymentMethods', () => {
  const ids = ['sepa-1234', 'revolut-1234', 'paypal-5678']
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
      {
        id: 'revolut-1234',
        label: 'Revolut',
        type: 'revolut',
        currencies: ['EUR'],
      },
      {
        id: 'paypal-5678',
        label: 'PayPal',
        type: 'paypal',
        currencies: ['EUR'],
      },
    ],
  })
  setPaymentMethods([
    { id: 'sepa', currencies: ['EUR', 'CHF'], anonymous: false },
    {
      id: 'revolut',
      currencies: ['EUR'],
      anonymous: false,
    },
    { id: 'paypal', currencies: ['EUR'], anonymous: false },
  ])

  it('should update the preferred payment methods', () => {
    useOfferPreferences.getState().setPaymentMethods(ids)
    const expected = {
      sepa: 'sepa-1234',
      revolut: 'revolut-1234',
      paypal: 'paypal-5678',
    }
    expect(useOfferPreferences.getState().preferredPaymentMethods).toStrictEqual(expected)
  })
  it('should update the means of payment', () => {
    useOfferPreferences.getState().setPaymentMethods(ids)
    const expected = {
      EUR: ['sepa', 'revolut', 'paypal'],
    }
    expect(useOfferPreferences.getState().meansOfPayment).toStrictEqual(expected)
  })
  it('should update the payment data', () => {
    useOfferPreferences.getState().setPaymentMethods(ids)
    const expected = {
      paypal: { country: undefined, hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a' },
      revolut: { country: undefined, hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a' },
      sepa: { country: undefined, hash: '94c30c03991f2923fae94566e32d9171e59ba045eea4c0607b4dbe17edfbf74e' },
    }
    expect(useOfferPreferences.getState().paymentData).toStrictEqual(expected)
  })
  it('should update the original payment data', () => {
    useOfferPreferences.getState().setPaymentMethods(ids)
    const expected = [
      {
        id: 'sepa-1234',
        iban: 'DE89370400440532013000',
        bic: 'COBADEFFXXX',
        label: 'SEPA',
        type: 'sepa',
        currencies: ['EUR'],
      },
      {
        id: 'revolut-1234',
        label: 'Revolut',
        type: 'revolut',
        currencies: ['EUR'],
      },
      {
        id: 'paypal-5678',
        label: 'PayPal',
        type: 'paypal',
        currencies: ['EUR'],
      },
    ]
    expect(useOfferPreferences.getState().originalPaymentData).toStrictEqual(expected)
  })
  it('should set can continue to false if the payment methods are not valid', () => {
    useOfferPreferences.getState().setPaymentMethods([])
    expect(useOfferPreferences.getState().canContinue.paymentMethods).toBe(false)
    useOfferPreferences.getState().setPaymentMethods(['sepa-1234'])
    expect(useOfferPreferences.getState().canContinue.paymentMethods).toBe(true)
  })
})

describe('useOfferPreferences - actions - selectPaymentMethod', () => {
  beforeAll(() => {
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
    setPaymentMethods([{ id: 'sepa', currencies: ['EUR', 'CHF'], anonymous: false }])
    useOfferPreferences.getState().setPaymentMethods([])
  })
  afterEach(() => {
    useOfferPreferences.getState().setPaymentMethods([])
  })
  const id = 'sepa-1234'
  it('should add the payment method to the preferred payment methods', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = {
      sepa: 'sepa-1234',
    }
    expect(useOfferPreferences.getState().preferredPaymentMethods).toStrictEqual(expected)
  })
  it('should remove the payment method if it is already in the preferred payment methods', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = {}
    expect(useOfferPreferences.getState().preferredPaymentMethods).toStrictEqual(expected)
  })
  it('should add the payment method to the means of payment', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = {
      EUR: ['sepa'],
    }
    expect(useOfferPreferences.getState().meansOfPayment).toStrictEqual(expected)
  })
  it('should remove the payment method if it is already in the means of payment', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = {}
    expect(useOfferPreferences.getState().meansOfPayment).toStrictEqual(expected)
  })
  it('should add the payment data to the payment data', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = {
      sepa: { country: undefined, hash: '94c30c03991f2923fae94566e32d9171e59ba045eea4c0607b4dbe17edfbf74e' },
    }
    expect(useOfferPreferences.getState().paymentData).toStrictEqual(expected)
  })
  it('should remove the payment data if it is already in the payment data', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = {}
    expect(useOfferPreferences.getState().paymentData).toStrictEqual(expected)
  })
  it('should add the payment data to the original payment data', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected = [
      {
        id: 'sepa-1234',
        iban: 'DE89370400440532013000',
        bic: 'COBADEFFXXX',
        label: 'SEPA',
        type: 'sepa',
        currencies: ['EUR'],
      },
    ]
    expect(useOfferPreferences.getState().originalPaymentData).toStrictEqual(expected)
  })
  it('should remove the payment data if it is already in the original payment data', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    useOfferPreferences.getState().selectPaymentMethod(id)
    const expected: PaymentData[] = []
    expect(useOfferPreferences.getState().originalPaymentData).toStrictEqual(expected)
  })
  it('should set can continue to true if the payment methods are valid', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    expect(useOfferPreferences.getState().canContinue.paymentMethods).toBe(true)
  })
  it('should set can continue to false if the payment methods are not valid', () => {
    useOfferPreferences.getState().selectPaymentMethod(id)
    useOfferPreferences.getState().selectPaymentMethod(id)
    expect(useOfferPreferences.getState().canContinue.paymentMethods).toBe(false)
  })
})

describe('useOfferPreferences - actions - setPrefferedCurrencyType', () => {
  it('should update the preferred currencytype', () => {
    expect(useOfferPreferences.getState().preferredCurrenyType).toBe('europe')
    useOfferPreferences.getState().setPreferredCurrencyType('other')
    expect(useOfferPreferences.getState().preferredCurrenyType).toBe('other')
  })
})
