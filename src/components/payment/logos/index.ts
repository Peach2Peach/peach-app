import amazon from './amazon.svg'
import bitcoin from './bitcoin.svg'
import bitcoinAmsterdam from './bitcoinAmsterdam.svg'
import bizum from './bizum.svg'
import blik from './blik.svg'
import mbWay from './mbWay.svg'
import paypal from './paypal.svg'
import revolut from './revolut.svg'
import satispay from './satispay.svg'
import sepa from './sepa.svg'
import swish from './swish.svg'
import twint from './twint.svg'
import wise from './wise.svg'

const PaymentLogos = {
  'cash.amsterdam': bitcoinAmsterdam,
  'cash.belgianEmbassy': bitcoin,
  'cash.lugano': bitcoin,
  'giftCard.amazon': amazon,
  amazon,
  bitcoin,
  bizum,
  blik,
  mbWay,
  paypal,
  revolut,
  satispay,
  sepa,
  swish,
  twint,
  wise,
}

export type PaymentLogoType = keyof typeof PaymentLogos

export default PaymentLogos
