declare type EuPaymentMethods =
  | 'advcash'
  | 'applePay'
  | 'bizum'
  | 'blik'
  | 'fasterPayments'
  | 'friends24'
  | 'instantSepa'
  | 'iris'
  | 'keksPay'
  | 'lydia'
  | 'mbWay'
  | 'mobilePay'
  | 'n26'
  | 'nationalTransferBG'
  | 'nationalTransferCZ'
  | 'nationalTransferDK'
  | 'nationalTransferHU'
  | 'nationalTransferNO'
  | 'nationalTransferPL'
  | 'nationalTransferRO'
  | 'nationalTransferTR'
  | 'neteller'
  | 'papara'
  | 'paylib'
  | 'paypal'
  | 'paysera'
  | 'revolut'
  | 'satispay'
  | 'sepa'
  | 'skrill'
  | 'straksbetaling'
  | 'swish'
  | 'twint'
  | 'verse'
  | 'vipps'
  | 'wise'
declare type LatAmPaymentMethods =
  | 'alias'
  | 'bancolombia'
  | 'cbu'
  | 'cvu'
  | 'mercadoPago'
  | 'nequi'
  | 'rappipay'
  | 'sinpe'
  | 'sinpeMovil'
declare type AfricaPaymentMethods =
  | 'airtelMoney'
  | 'chippercash'
  | 'eversend'
  | 'm-pesa'
  | 'moov'
  | 'mtn'
  | 'nationalTransferNG'
  | 'orangeMoney'
  | 'payday'
  | 'wave'
declare type BitcoinPaymentMethods = 'liquid' | 'lnurl'
declare type InternationalPaymentMethds = 'giftCard.amazon' | `giftCard.amazon.${Country}`
declare type CashPaymentMethds = `cash.${string}`

declare type PaymentMethod =
  | EuPaymentMethods
  | LatAmPaymentMethods
  | AfricaPaymentMethods
  | InternationalPaymentMethds
  | BitcoinPaymentMethods
  | CashPaymentMethds
