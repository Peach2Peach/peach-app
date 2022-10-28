import amazon from './amazon.svg'
import bizum from './bizum.svg'
import mbWay from './mbWay.svg'
import paypal from './paypal.svg'
import revolut from './revolut.svg'
import satispay from './satispay.svg'
import swish from './swish.svg'
import twint from './twint.svg'
import wise from './wise.svg'
import bitcoin from './bitcoin.svg'
import bitcoinAmsterdam from './bitcoinAmsterdam.svg'

const PaymentLogos = {
  amazon,
  'giftCard.amazon': amazon,
  bizum,
  mbWay,
  paypal,
  revolut,
  swish,
  satispay,
  twint,
  wise,
  'cash.amsterdam': bitcoinAmsterdam,
  'cash.belgianEmbassy': bitcoin,
  'cash.lugano': bitcoin,
}

export type PaymentLogoType = keyof typeof PaymentLogos

export default PaymentLogos
