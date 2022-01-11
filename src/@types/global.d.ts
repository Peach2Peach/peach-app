declare type PaymentData = {
  id: string,
  [key: string]: string
}

// TODO consider hashing payment methods to have proof that payment method did not change at later point
declare type SellOffer = {
  type: 'ask',
  amount: number,
  premium: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  kyc: boolean;
  kycType?: KYCType;
  returnAddress?: string;
}