import { Psbt } from 'bitcoinjs-lib'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { getEscrowWalletForOffer, setWallet } from '../wallet'
import { verifyAndSignReleaseTx } from './verifyAndSignReleaseTx'

const fromBase64Mock = jest.fn()
jest.mock('bitcoinjs-lib', () => ({
  ...jest.requireActual('bitcoinjs-lib'),
  Psbt: {
    fromBase64: () => fromBase64Mock(),
  },
}))

const verifyPSBTMock = jest.fn()
jest.mock('../../views/contract/helpers/verifyPSBT', () => ({
  verifyPSBT: (...args: any[]) => verifyPSBTMock(...args),
}))
jest.mock('../wallet/getNetwork', () => ({
  getNetwork: jest.fn(),
}))

// eslint-disable-next-line max-lines-per-function
describe('verifyAndSignReleaseTx', () => {
  const mockSellOffer = {
    id: '12',
    funding: {
      txIds: ['txid1'],
      vouts: [0],
      amounts: [10000],
    },
    amount: 10000,
  }
  const mockContract: Partial<Contract> = {
    id: '12-13',
    symmetricKeyEncrypted: 'mockSymmetricKeyEncrypted',
    symmetricKeySignature: 'mockSymmetricKeySignature',
    buyer: {
      id: 'mockBuyerId',
      pgpPublicKey: 'mockPgpPublicKey',
    } as User,
    seller: {
      id: 'mockSellerId',
    } as User,
    releaseTransaction: 'mockReleaseTransaction',
  }
  setWallet(createTestWallet())

  const wallet = getEscrowWalletForOffer(mockSellOffer as SellOffer)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return null and error message if psbt is not valid', () => {
    verifyPSBTMock.mockReturnValueOnce('INVALID_INPUT')

    const [tx, error] = verifyAndSignReleaseTx(mockContract as Contract, mockSellOffer as SellOffer, wallet)

    expect(tx).toBe(null)
    expect(error).toBe('INVALID_INPUT')
  })

  it('should sign valid release transaction and return it', () => {
    const finalizeInputMock = jest.fn()
    const psbt: Partial<Psbt> = {
      signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
      extractTransaction: jest.fn().mockReturnValue({
        toHex: jest.fn().mockReturnValue('transactionAsHex'),
      }),
      txInputs: [{}] as Psbt['txInputs'],
      txOutputs: [
        {
          address: 'address1',
          value: 9000,
        },
        {
          address: 'address2',
          value: 1000,
        },
      ] as Psbt['txOutputs'],
    }
    fromBase64Mock.mockReturnValue(psbt as Psbt)
    verifyPSBTMock.mockReturnValueOnce(null)
    const [tx, error] = verifyAndSignReleaseTx(mockContract as Contract, mockSellOffer as SellOffer, wallet)

    expect(error).toBe(null)
    expect(tx).toEqual('transactionAsHex')
    expect(psbt.signInput).toHaveBeenCalled()
    expect(finalizeInputMock).toHaveBeenCalled()
    expect(psbt.extractTransaction).toHaveBeenCalled()
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled()
  })
})
