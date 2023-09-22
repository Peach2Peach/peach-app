/* eslint-disable max-lines-per-function */
import { PaymentMethodForms } from './paymentMethodForms'

import {
  Template1,
  Template10,
  Template11,
  Template12,
  Template13,
  Template14,
  Template15,
  Template16,
  Template17,
  Template18,
  Template2,
  Template21,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
} from '../templates'
import { GiftCardAmazon } from './GiftCardAmazon'

describe('paymentMethodForms', () => {
  // eslint-disable-next-line max-statements
  it('should assign the correct template to each europeaen payment methods', () => {
    expect(PaymentMethodForms.sepa).toStrictEqual({
      component: Template1,
      fields: ['method', 'price', 'beneficiary', 'iban', 'bic', 'reference'],
    })
    expect(PaymentMethodForms.fasterPayments).toStrictEqual({ component: Template5, fields: expect.any(Array) })
    expect(PaymentMethodForms.instantSepa).toStrictEqual({
      component: Template1,
      fields: ['method', 'price', 'beneficiary', 'iban', 'bic', 'reference'],
    })
    expect(PaymentMethodForms.paypal).toStrictEqual({ component: Template6, fields: expect.any(Array) })
    expect(PaymentMethodForms.revolut).toStrictEqual({ component: Template6, fields: expect.any(Array) })
    expect(PaymentMethodForms.vipps).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.advcash).toStrictEqual({ component: Template2, fields: expect.any(Array) })
    expect(PaymentMethodForms.blik).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.wise).toStrictEqual({ component: Template6, fields: expect.any(Array) })
    expect(PaymentMethodForms.twint).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.swish).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.satispay).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.mbWay).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.bizum).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.mobilePay).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.skrill).toStrictEqual({ component: Template4, fields: expect.any(Array) })
    expect(PaymentMethodForms.neteller).toStrictEqual({ component: Template4, fields: expect.any(Array) })
    expect(PaymentMethodForms.paysera).toStrictEqual({ component: Template8, fields: expect.any(Array) })
    expect(PaymentMethodForms.straksbetaling).toStrictEqual({ component: Template7, fields: expect.any(Array) })
    expect(PaymentMethodForms.keksPay).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.friends24).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.n26).toStrictEqual({ component: Template6, fields: expect.any(Array) })
    expect(PaymentMethodForms.paylib).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.lydia).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.iris).toStrictEqual({ component: Template3, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferCZ).toStrictEqual({ component: Template9, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferDK).toStrictEqual({ component: Template9, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferHU).toStrictEqual({ component: Template9, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferNO).toStrictEqual({ component: Template9, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferPL).toStrictEqual({ component: Template9, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferRO).toStrictEqual({ component: Template9, fields: expect.any(Array) })
    expect(PaymentMethodForms.nationalTransferTR).toStrictEqual({
      component: Template9,
      fields: ['method', 'price', 'beneficiary', 'iban', 'accountNumber', 'bic', 'reference'],
    })
    expect(PaymentMethodForms.papara).toStrictEqual({
      component: Template3,
      fields: ['method', 'price', 'beneficiary', 'phone', 'reference'],
    })
  })
  it('should assign the correct template to each international payment methods', () => {
    expect(PaymentMethodForms['giftCard.amazon']).toStrictEqual({ component: GiftCardAmazon, fields: expect.any(Array) })
    expect(PaymentMethodForms['giftCard.amazon.DE']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.ES']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.FI']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.FR']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.IT']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.NL']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.SE']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
    expect(PaymentMethodForms['giftCard.amazon.UK']).toStrictEqual({
      component: GiftCardAmazon,
      fields: expect.any(Array),
    })
  })
  it('should assign the correct template to each bitcoin payment methods', () => {
    expect(PaymentMethodForms.liquid).toStrictEqual({
      component: Template10,
      fields: ['method', 'price', 'receiveAddress'],
    })
    expect(PaymentMethodForms.lnurl).toStrictEqual({
      component: Template11,
      fields: ['method', 'price', 'lnurlAddress'],
    })
  })
  it('should assign the correct template to each latin american payment methods', () => {
    expect(PaymentMethodForms.rappipay).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.mercadoPago).toStrictEqual({
      component: Template13,
      fields: ['method', 'price', 'phone', 'email', 'reference'],
    })
    expect(PaymentMethodForms.nequi).toStrictEqual({
      component: Template3,
      fields: ['method', 'price', 'beneficiary', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.cbu).toStrictEqual({
      component: Template14,
      fields: ['method', 'price', 'beneficiary', 'accountNumber', 'reference'],
    })
    expect(PaymentMethodForms.cvu).toStrictEqual({
      component: Template15,
      fields: ['method', 'price', 'beneficiary', 'accountNumber', 'reference'],
    })
    expect(PaymentMethodForms.alias).toStrictEqual({
      component: Template16,
      fields: ['method', 'price', 'beneficiary', 'accountNumber', 'reference'],
    })
    expect(PaymentMethodForms.bancolombia).toStrictEqual({
      component: Template17,
      fields: ['method', 'price', 'beneficiary', 'accountNumber', 'reference'],
    })
    expect(PaymentMethodForms.sinpe).toStrictEqual({
      component: Template1,
      fields: ['method', 'price', 'beneficiary', 'iban', 'bic', 'reference'],
    })
    expect(PaymentMethodForms.sinpeMovil).toStrictEqual({
      component: Template3,
      fields: ['method', 'price', 'beneficiary', 'phone', 'reference'],
    })
  })
  it('should assign the correct template to each african payment methods', () => {
    expect(PaymentMethodForms.orangeMoney).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.moov).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.wave).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.airtelMoney).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms['m-pesa']).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.nationalTransferNG).toStrictEqual({
      component: Template21,
      fields: ['method', 'price', 'beneficiary', 'accountNumber', 'reference'],
    })
    expect(PaymentMethodForms.chippercash).toStrictEqual({
      component: Template18,
      fields: ['method', 'price', 'userName', 'reference'],
    })
    expect(PaymentMethodForms.mtn).toStrictEqual({
      component: Template12,
      fields: ['method', 'price', 'phone', 'reference'],
    })
    expect(PaymentMethodForms.eversend).toStrictEqual({
      component: Template18,
      fields: ['method', 'price', 'userName', 'reference'],
    })
    expect(PaymentMethodForms.payday).toStrictEqual({
      component: Template18,
      fields: ['method', 'price', 'userName', 'reference'],
    })
  })
})
