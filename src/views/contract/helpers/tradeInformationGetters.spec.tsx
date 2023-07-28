import { contract } from '../../../../tests/unit/data/contractData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { WalletLabel } from '../../../components/offer/WalletLabel'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import {
  tradeInformationGetters,
  isTradeInformationGetter,
  activeSellOfferFields,
  pastSellOfferFields,
  pastBuyOfferFields,
} from './tradeInformationGetters'

jest.mock('../../../utils/offer/getWalletLabel', () => ({
  getWalletLabel: jest.fn(() => 'walletLabel'),
}))

const getBuyOfferFromContractMock = jest.fn(() => ({
  walletLabel: 'buyOfferWalletLabel',
  releaseAddress: 'releaseAddress',
}))
jest.mock('../../../utils/contract/getBuyOfferFromContract', () => ({
  getBuyOfferFromContract: () => getBuyOfferFromContractMock(),
}))

describe('tradeInformationGetters', () => {
  it('should return the correct value for the price field', () => {
    expect(tradeInformationGetters.price(contract)).toEqual('89.04 EUR')
    expect(tradeInformationGetters.price({ ...contract, price: 12345, currency: 'SAT' })).toEqual('12 345 SAT')
  })
  it('should apply the priceFormat function to the price field', () => {
    expect(tradeInformationGetters.price({ ...contract, price: 21000000 })).toEqual('21 000 000.00 EUR')
  })
  it('should return the correct value for the paidToMethod field', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    expect(tradeInformationGetters.paidToMethod({ ...contract, paymentData: validSEPAData })).toEqual(
      validSEPAData.label,
    )
    expect(tradeInformationGetters.paidToMethod(contract)).toEqual(undefined)
  })
  it('should return the correct value for the paidWithMethod field', () => {
    expect(tradeInformationGetters.paidWithMethod(contract)).toEqual('SEPA')
  })
  it('should return the correct value for the paidToWallet field', () => {
    expect(tradeInformationGetters.paidToWallet(contract)).toEqual(
      <WalletLabel address="releaseAddress" label="buyOfferWalletLabel" />,
    )
    getBuyOfferFromContractMock.mockReturnValueOnce({ walletLabel: '', releaseAddress: 'releaseAddress' })
    expect(tradeInformationGetters.paidToWallet(contract)).toEqual(<WalletLabel address="releaseAddress" label="" />)
  })
  it('should return the correct value for the bitcoinAmount field', () => {
    expect(tradeInformationGetters.bitcoinAmount(contract)).toEqual(250000)
  })
  it('should return the correct value for the bitcoinPrice field', () => {
    expect(tradeInformationGetters.bitcoinPrice(contract)).toEqual('35 089.66 EUR')
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
    expect(isTradeInformationGetter('name')).toEqual(false)
  })
})

describe('fields', () => {
  test('activeSellOfferFields are correct', () => {
    expect(activeSellOfferFields).toEqual(['price', 'reference', 'paidToMethod', 'via'])
  })
  test('pastSellOfferFields are correct', () => {
    expect(pastSellOfferFields).toEqual(['price', 'paidToMethod', 'via', 'bitcoinAmount', 'bitcoinPrice'])
  })
  test('pastBuyOfferFields are correct', () => {
    expect(pastBuyOfferFields).toEqual(['price', 'paidWithMethod', 'bitcoinAmount', 'bitcoinPrice', 'paidToWallet'])
  })
})
