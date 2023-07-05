export const isAmazonGiftCard = (paymentMethod: PaymentMethod): paymentMethod is AmazonGiftCard =>
  paymentMethod.startsWith('giftCard.amazon')
