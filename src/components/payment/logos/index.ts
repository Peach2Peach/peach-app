import amazon from './amazon.svg'
import bizum from './bizum.svg'
import mbWay from './mbWay.svg'
import paypal from './paypal.svg'
import revolut from './revolut.svg'
import swish from './swish.svg'
import twint from './twint.svg'
import wise from './wise.svg'

const PaymentLogos = {
  amazon,
  'giftCard.amazon': amazon,
  bizum,
  mbWay,
  paypal,
  revolut,
  swish,
  twint,
  wise,
}

export type PaymentLogoType = keyof typeof PaymentLogos

export default PaymentLogos
