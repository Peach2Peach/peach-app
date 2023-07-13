import { StackNavigation } from '../../../utils/navigation/handlePushNotification'
import { handleMissingPaymentData } from './handleMissingPaymentData'

describe('handleMissingPaymentData', () => {
  let message: MessageState
  const updateMessage = jest.fn((value) => (message = value))
  const navigation = { push: jest.fn() } as unknown as StackNavigation
  const offer = { id: 1 } as unknown as BuyOffer | SellOffer
  const currency = 'EUR'
  const paymentMethod = 'sepa'

  afterEach(() => {
    updateMessage(undefined)
  })

  it('should be defined', () => {
    expect(handleMissingPaymentData).toBeDefined()
  })
  it('should call updateMessage with the correct parameters', () => {
    handleMissingPaymentData(offer, currency, paymentMethod, updateMessage, navigation)

    expect(message).toStrictEqual({
      msgKey: 'PAYMENT_DATA_MISSING',
      level: 'ERROR',
      action: {
        callback: expect.any(Function),
        label: 're-enter your details',
      },
      keepAlive: true,
    })
  })
  it('should update the message when the callback is called', () => {
    handleMissingPaymentData(offer, currency, paymentMethod, updateMessage, navigation)
    message?.action?.callback()

    expect(message).toStrictEqual({
      msgKey: undefined,
      level: 'ERROR',
    })
  })
  it('should call navigation.push when the callback is called', () => {
    handleMissingPaymentData(offer, currency, paymentMethod, updateMessage, navigation)
    message?.action?.callback()

    expect(navigation.push).toHaveBeenCalledWith('paymentMethodForm', {
      paymentData: {
        type: 'sepa',
        label: 'SEPA #1',
        currencies: ['EUR'],
        country: undefined,
      },
      origin: 'search',
    })
  })
  it('should detect gift cards', () => {
    handleMissingPaymentData(offer, currency, 'giftCard.amazon.DE', updateMessage, navigation)
    message?.action?.callback()

    expect(navigation.push).toHaveBeenCalledWith('paymentMethodForm', {
      paymentData: {
        label: 'Amazon Gift Card (DE) #1',
        type: 'giftCard.amazon.DE',
        currencies: ['EUR'],
        country: 'DE',
      },
      origin: 'search',
    })
  })
})
