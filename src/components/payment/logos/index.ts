import nationalTransferBG from '../../flags/bg.svg'
import nationalTransferCZ from '../../flags/cz.svg'
import nationalTransferDK from '../../flags/dk.svg'
import nationalTransferHU from '../../flags/hu.svg'
import nationalTransferNO from '../../flags/no.svg'
import nationalTransferPL from '../../flags/pl.svg'
import nationalTransferRO from '../../flags/ro.svg'
import advcash from './advcash.svg'
import amazon from './amazon.svg'
import bancolombia from './bancolombia.svg'
import bitcoin from './bitcoin.svg'
import bitcoinAmsterdam from './bitcoinAmsterdam.svg'
import bizum from './bizum.svg'
import blik from './blik.svg'
import fasterPayments from './fasterPayments.svg'
import friends24 from './friends24.svg'
import keksPay from './keksPay.svg'
import liquid from './liquid.svg'
import lydia from './lydia.svg'
import mbWay from './mbWay.svg'
import mobilePay from './mobilePay.svg'
import moov from './moov.svg'
import n26 from './n26.svg'
import nequi from './nequi.svg'
import neteller from './neteller.svg'
import orangeMoney from './orangeMoney.svg'
import paylib from './paylib.svg'
import paypal from './paypal.svg'
import paysera from './paysera.svg'
import placeholder from './placeholder.svg'
import revolut from './revolut.svg'
import satispay from './satispay.svg'
import sepa from './sepa.svg'
import skrill from './skrill.svg'
import swish from './swish.svg'
import twint from './twint.svg'
import verse from './verse.svg'
import vipps from './vipps.svg'
import wave from './wave.svg'
import wise from './wise.svg'

export const PaymentLogos = {
  'cash.amsterdam': bitcoinAmsterdam,
  'cash.belgianEmbassy': bitcoin,
  'cash.lugano': bitcoin,
  'giftCard.amazon': amazon,
  advcash,
  alias: placeholder,
  amazon,
  bitcoin,
  bizum,
  blik,
  bancolombia,
  cbu: placeholder,
  cvu: placeholder,
  fasterPayments,
  friends24,
  instantSepa: sepa,
  iris: placeholder,
  keksPay,
  liquid,
  lydia,
  mbWay,
  mercadoPago: placeholder,
  mobilePay,
  moov,
  n26,
  nationalTransferBG,
  nationalTransferCZ,
  nationalTransferDK,
  nationalTransferHU,
  nationalTransferNO,
  nationalTransferPL,
  nationalTransferRO,
  nequi,
  neteller,
  orangeMoney,
  paylib,
  paypal,
  paysera,
  rappipay: placeholder,
  revolut,
  satispay,
  sepa,
  skrill,
  straksbetaling: placeholder,
  swish,
  twint,
  verse,
  vipps,
  wave,
  wise,
}

export type PaymentLogoType = keyof typeof PaymentLogos
