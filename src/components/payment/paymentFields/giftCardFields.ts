import { GIFTCARDCOUNTRIES } from '../../../constants'

export const giftCardFields = GIFTCARDCOUNTRIES.reduce((obj, c) => {
  const id: PaymentMethod = `giftCard.amazon.${c}`
  obj[id] = ['beneficiary', 'email']
  return obj
}, {} as Record<AmazonGiftCard, (keyof PaymentData)[]>)
