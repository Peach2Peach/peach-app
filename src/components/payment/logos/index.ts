import amazon from './amazon.svg'
import paypal from './paypal.svg'
import revolut from './revolut.svg'
import wise from './wise.svg'

const PaymentLogos = {
  amazon,
  paypal,
  revolut,
  wise,
}

export type PaymentLogoType = keyof typeof PaymentLogos

export default PaymentLogos
