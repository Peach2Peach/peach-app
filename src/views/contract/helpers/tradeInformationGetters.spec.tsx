import { render } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { isTradeInformationGetter, tradeInformationGetters } from './tradeInformationGetters'

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
    const element = tradeInformationGetters.paidToMethod({ ...contract, paymentData: validSEPAData }) as JSX.Element
    expect(render(element).toJSON()).toMatchSnapshot()
  })
  it('should return the correct value for the paidWithMethod field', () => {
    expect(tradeInformationGetters.paidWithMethod(contract)).toEqual('SEPA')
  })
  it('should return the correct value for the bitcoinAmount field', () => {
    expect(tradeInformationGetters.bitcoinAmount(contract)).toEqual(250000)
  })
  it('should return the correct value for the bitcoinPrice field', () => {
    expect(tradeInformationGetters.bitcoinPrice(contract)).toEqual('35 616.00 EUR')
    expect(tradeInformationGetters.bitcoinPrice({ ...contract, currency: 'SAT', amount: 40000, price: 40600 })).toEqual(
      '101 500 000 SAT',
    )
  })
  it('should return the correct value for the via field', () => {
    const element = tradeInformationGetters.via({ ...contract, paymentData: validSEPAData }) as JSX.Element
    expect(render(element).toJSON()).toMatchSnapshot()
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
