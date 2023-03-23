import amazon from './amazon.svg'
import advcash from './advcash.svg'
import bitcoin from './bitcoin.svg'
import bitcoinAmsterdam from './bitcoinAmsterdam.svg'
import bizum from './bizum.svg'
import fasterPayments from './fasterPayments.svg'
import blik from './blik.svg'
import mbWay from './mbWay.svg'
import mobilePay from './mobilePay.svg'
import paypal from './paypal.svg'
import revolut from './revolut.svg'
import satispay from './satispay.svg'
import sepa from './sepa.svg'
import swish from './swish.svg'
import twint from './twint.svg'
import vipps from './vipps.svg'
import wise from './wise.svg'
import skrill from './skrill.svg'
import neteller from './neteller.svg'
import paysera from './paysera.svg'
import nationalTransferBG from '../../flags/bg.svg'
import nationalTransferCZ from '../../flags/cz.svg'
import nationalTransferDK from '../../flags/dk.svg'
import nationalTransferHU from '../../flags/hu.svg'
import nationalTransferNO from '../../flags/no.svg'
import nationalTransferPL from '../../flags/pl.svg'
import nationalTransferRO from '../../flags/ro.svg'

const PaymentLogos = {
  'cash.amsterdam': bitcoinAmsterdam,
  'cash.belgianEmbassy': bitcoin,
  'cash.lugano': bitcoin,
  'giftCard.amazon': amazon,
  amazon,
  advcash,
  bitcoin,
  bizum,
  fasterPayments,
  blik,
  mbWay,
  mobilePay,
  paypal,
  revolut,
  satispay,
  sepa,
  instantSepa: sepa,
  swish,
  twint,
  vipps,
  wise,
  skrill,
  neteller,
  paysera,
  nationalTransferBG,
  nationalTransferCZ,
  nationalTransferDK,
  nationalTransferHU,
  nationalTransferNO,
  nationalTransferPL,
  nationalTransferRO,
}

export type PaymentLogoType = keyof typeof PaymentLogos

export default PaymentLogos
