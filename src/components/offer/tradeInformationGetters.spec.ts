import { contract } from '../../../tests/unit/data/contractData'
import { tradeInformationGetters, isTradeInformationGetter } from './tradeInformationGetters'

jest.mock('../../utils/offer/getPaymentDataByMethod', () => ({
  getPaymentDataByMethod: jest.fn(() => ({
    label: 'sepa',
  })),
}))

jest.mock('../../utils/offer/getWalletLabel', () => ({
  getWalletLabel: jest.fn(() => 'walletLabel'),
}))

const getBuyOfferFromContractMock = jest.fn(() => ({
  walletLabel: 'buyOfferWalletLabel',
  releaseAddress: 'releaseAddress',
}))
jest.mock('../../utils/contract/getBuyOfferFromContract', () => ({
  getBuyOfferFromContract: () => getBuyOfferFromContractMock(),
}))

describe('tradeInformationGetters', () => {
  it('should return the correct value for the price field', () => {
    expect(tradeInformationGetters.price(contract)).toEqual('89.04 EUR')
  })
  it('should return the correct value for the paidToMethod field', () => {
    expect(
      tradeInformationGetters.paidToMethod({
        ...contract,
        paymentData: { type: 'sepa', label: 'sepa', id: '123', currencies: ['EUR'] },
      }),
    ).toEqual('sepa')
    expect(tradeInformationGetters.paidToMethod(contract)).toEqual(undefined)
  })
  it('should return the correct value for the paidWithMethod field', () => {
    expect(tradeInformationGetters.paidWithMethod(contract)).toEqual('sepa')
  })
  it('should return the correct value for the paidToWallet field', () => {
    expect(tradeInformationGetters.paidToWallet(contract)).toEqual('buyOfferWalletLabel')
    getBuyOfferFromContractMock.mockReturnValueOnce({ walletLabel: '', releaseAddress: 'releaseAddress' })
    expect(tradeInformationGetters.paidToWallet(contract)).toEqual('walletLabel')
  })
  it('should return the correct value for the bitcoinAmount field', () => {
    expect(tradeInformationGetters.bitcoinAmount(contract)).toEqual(250000)
  })
  it('should return the correct value for the bitcoinPrice field', () => {
    expect(tradeInformationGetters.bitcoinPrice(contract)).toEqual('35 089 .66 EUR')
  })
  it('should return the correct value for the via field', () => {
    expect(tradeInformationGetters.via(contract)).toEqual('SEPA')
  })
  it('should return the correct value for the method field', () => {
    expect(tradeInformationGetters.method(contract)).toEqual('SEPA')
  })
})

describe('isTradeInformationGetter', () => {
  it('should return true if the field name is a valid trade information getter', () => {
    expect(isTradeInformationGetter('price')).toEqual(true)
  })
  it('should return false if the field name is not a valid trade information getter', () => {
    expect(isTradeInformationGetter('foo')).toEqual(false)
  })
})
