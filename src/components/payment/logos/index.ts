import nationalTransferBG from '../../flags/bg.svg'
import nationalTransferCH from '../../flags/ch.svg'
import nationalTransferCZ from '../../flags/cz.svg'
import nationalTransferDK from '../../flags/dk.svg'
import nationalTransferHU from '../../flags/hu.svg'
import nationalTransferIS from '../../flags/is.svg'
import nationalTransferNG from '../../flags/ng.svg'
import nationalTransferNO from '../../flags/no.svg'
import nationalTransferPL from '../../flags/pl.svg'
import nationalTransferRO from '../../flags/ro.svg'
import nationalTransferSE from '../../flags/se.svg'
import nationalTransferTR from '../../flags/tr.svg'
import advcash from './advcash.svg'
import airtelMoney from './airtelMoney.svg'
import amazon from './amazon.svg'
import bancolombia from './bancolombia.svg'
import bitcoin from './bitcoin.svg'
import bitcoinAmsterdam from './bitcoinAmsterdam.svg'
import bizum from './bizum.svg'
import blik from './blik.svg'
import chippercash from './chippercash.svg'
import eversend from './eversend.svg'
import fasterPayments from './fasterPayments.svg'
import friends24 from './friends24.svg'
import keksPay from './keksPay.svg'
import liquid from './liquid.svg'
import lydia from './lydia.svg'
import mPesa from './m-pesa.svg'
import mbWay from './mbWay.svg'
import mobilePay from './mobilePay.svg'
import moov from './moov.svg'
import mtn from './mtn.svg'
import n26 from './n26.svg'
import nequi from './nequi.svg'
import neteller from './neteller.svg'
import orangeMoney from './orangeMoney.svg'
import papara from './papara.svg'
import paylib from './paylib.svg'
import paypal from './paypal.svg'
import paysera from './paysera.svg'
import placeholder from './placeholder.svg'
import revolut from './revolut.svg'
import satispay from './satispay.svg'
import sepa from './sepa.svg'
import sinpeMovil from './sinpeMovil.svg'
import skrill from './skrill.svg'
import swish from './swish.svg'
import twint from './twint.svg'
import vipps from './vipps.svg'
import wave from './wave.svg'
import wise from './wise.svg'

export const PaymentLogos = {
  'cash.amsterdam': bitcoinAmsterdam,
  'cash.belgianEmbassy': bitcoin,
  'cash.lugano': bitcoin,
  'giftCard.amazon': amazon,
  'm-pesa': mPesa,
  accrue: placeholder,
  advcash,
  airtelMoney,
  alias: placeholder,
  amazon,
  bancolombia,
  bankera: placeholder,
  bitcoin,
  bizum,
  blik,
  cbu: placeholder,
  chippercash,
  cvu: placeholder,
  eversend,
  fasterPayments,
  friends24,
  instantSepa: sepa,
  iris: placeholder,
  keksPay,
  klasha: placeholder,
  liquid,
  lydia,
  mbWay,
  mercadoPago: placeholder,
  mobilePay,
  moov,
  mtn,
  n26,
  nationalTransferBG,
  nationalTransferCH,
  nationalTransferCZ,
  nationalTransferDK,
  nationalTransferHU,
  nationalTransferIS,
  nationalTransferNG,
  nationalTransferNO,
  nationalTransferPL,
  nationalTransferRO,
  nationalTransferSE,
  nationalTransferTR,
  nequi,
  neteller,
  orangeMoney,
  papara,
  payday: placeholder,
  paylib,
  paypal,
  paysera,
  pix: placeholder,
  postePay: placeholder,
  rappipay: placeholder,
  rebellion: placeholder,
  revolut,
  satispay,
  sepa,
  sinpe: placeholder,
  sinpeMovil,
  skrill,
  straksbetaling: placeholder,
  swish,
  twint,
  vipps,
  wave,
  wirepay: placeholder,
  wise,
}

export type PaymentLogoType = keyof typeof PaymentLogos
