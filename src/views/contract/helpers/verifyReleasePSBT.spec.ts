import { contract } from '../../../../tests/unit/data/contractData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { constructPSBT } from '../../../../tests/unit/helpers/constructPSBT'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { useConfigStore } from '../../../store/configStore/configStore'
import { defaultConfig } from '../../../store/configStore/defaultConfig'
import { verifyReleasePSBT } from './verifyReleasePSBT'

const wallet = createTestWallet()
const psbt = constructPSBT(wallet, undefined, { value: contract.amount, address: contract.releaseAddress })
const feeAmount = contract.amount * defaultConfig.peachFee
const psbtWithFeeOutput = constructPSBT(wallet, undefined, {
  value: contract.amount - feeAmount,
  address: contract.releaseAddress,
})
psbtWithFeeOutput.addOutput({
  address: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  value: feeAmount,
})
const mockSellOfferWithoutFunding = sellOffer
const mockSellOffer = {
  ...sellOffer,
  funding: { ...sellOffer.funding, txIds: ['d8a31704d33febfc8a4271c3f9d65b5d7679c5cab19f25058f2d7d2bc6e7b86c'] },
}
describe('verifyReleasePSBT', () => {
  afterEach(() => {
    useConfigStore.getState().reset()
  })

  it('should verify a valid release PSBT', () => {
    expect(verifyReleasePSBT(psbtWithFeeOutput, mockSellOffer, { ...contract, buyerFee: defaultConfig.peachFee })).toBe(
      '',
    )
  })
  it('should handle missing data', () => {
    expect(verifyReleasePSBT(psbt, undefined, contract)).toBe('MISSING_DATA')
    expect(verifyReleasePSBT(psbt, mockSellOffer, undefined)).toBe('MISSING_DATA')
    expect(verifyReleasePSBT(psbt, mockSellOfferWithoutFunding, contract)).toBe('MISSING_DATA')
  })
  it('should handle invalid funding inputs', () => {
    const sellOfferWithDifferentFundingTx = {
      ...mockSellOffer,
      funding: { ...mockSellOffer.funding, txIds: ['someOtherId'] },
    }
    expect(verifyReleasePSBT(psbt, sellOfferWithDifferentFundingTx, contract)).toBe('INVALID_INPUT')
  })
  it('should handle invalid release address', () => {
    const contractWithDifferentAddress = {
      ...contract,
      releaseAddress: 'differentAddress',
    }
    expect(verifyReleasePSBT(psbt, mockSellOffer, contractWithDifferentAddress)).toBe('RETURN_ADDRESS_MISMATCH')
  })
  it('should handle invalid buyer release amount', () => {
    const contractWithDifferentAmount = { ...contract, amount: contract.amount * 2 }
    expect(verifyReleasePSBT(psbtWithFeeOutput, mockSellOffer, contractWithDifferentAmount)).toBe('INVALID_OUTPUT')
  })
  it('should handle missing peachFee', () => {
    expect(verifyReleasePSBT(psbt, mockSellOffer, { ...contract, buyerFee: defaultConfig.peachFee })).toBe(
      'INVALID_OUTPUT',
    )
  })
  it('should handle invalid peach fee', () => {
    useConfigStore.setState({ peachFee: defaultConfig.peachFee / 2 })
    expect(verifyReleasePSBT(psbtWithFeeOutput, mockSellOffer, contract)).toBe('INVALID_OUTPUT')
  })
  it("should handle invalid buyer output when there's no peach fee", () => {
    useConfigStore.setState({ peachFee: 0 })
    expect(verifyReleasePSBT(psbtWithFeeOutput, mockSellOffer, contract)).toBe('INVALID_OUTPUT')
  })
  it("should handle valid buyer output when there's no peach fee", () => {
    useConfigStore.setState({ peachFee: 0 })
    expect(verifyReleasePSBT(psbt, mockSellOffer, contract)).toBe('')
  })
  it('should handle 0 peachFees for buyer set on contract', () => {
    const contractWithNoBuyerFee = { ...contract, buyerFee: 0 }
    expect(verifyReleasePSBT(psbt, mockSellOffer, contractWithNoBuyerFee)).toBe('')
  })
})
