import { getTradeBreakdown } from '../../../../src/utils/bitcoin'

const fromBase64Mock = jest.fn()
jest.mock('bitcoinjs-lib', () => ({
  ...jest.requireActual('bitcoinjs-lib'),
  Psbt: {
    fromBase64: () => fromBase64Mock(),
  },
}))

const getNetworkMock = jest.fn().mockReturnValue('regtest')
jest.mock('../../../../src/utils/wallet', () => ({
  getNetwork: () => getNetworkMock(),
}))

describe('getTradeBreakdown', () => {
  const releaseTransaction = 'releaseTransaction'
  const releaseAddress = 'releaseAddress'
  it('should return the correct breakdown', () => {
    const inputAmount = 100
    const psbt = {
      txOutputs: [
        {
          address: 'address1',
          value: 20,
        },
        {
          address: releaseAddress,
          value: 30,
        },
      ],
    }
    fromBase64Mock.mockReturnValue(psbt)
    const breakdown = getTradeBreakdown(releaseTransaction, releaseAddress, inputAmount)
    expect(breakdown).toEqual({
      totalAmount: inputAmount,
      peachFee: 20,
      networkFee: 50,
      amountReceived: 30,
    })
  })

  it('should return 0 if the release address is not found', () => {
    const inputAmount = 100
    const psbt = {
      txOutputs: [
        {
          address: 'address1',
          value: 10,
        },
        {
          address: 'address2',
          value: 20,
        },
      ],
    }
    fromBase64Mock.mockReturnValue(psbt)
    const breakdown = getTradeBreakdown(releaseTransaction, releaseAddress, inputAmount)
    expect(breakdown).toEqual({
      totalAmount: 0,
      peachFee: 0,
      networkFee: 0,
      amountReceived: 0,
    })
  })
  it('should handle the case where there is no peach fee', () => {
    const inputAmount = 100
    const psbt = {
      txOutputs: [
        {
          address: releaseAddress,
          value: 30,
        },
      ],
    }
    fromBase64Mock.mockReturnValue(psbt)
    const breakdown = getTradeBreakdown(releaseTransaction, releaseAddress, inputAmount)
    expect(breakdown).toEqual({
      totalAmount: inputAmount,
      peachFee: 0,
      networkFee: 70,
      amountReceived: 30,
    })
  })
})
