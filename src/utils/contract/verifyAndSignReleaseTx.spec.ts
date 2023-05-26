import { Psbt, networks } from 'bitcoinjs-lib'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { getEscrowWalletForOffer, setWallet } from '../wallet'
import { verifyAndSignReleaseTx } from './verifyAndSignReleaseTx'

const fromBase64Mock = jest.fn()
jest.mock('bitcoinjs-lib', () => ({
  ...jest.requireActual('bitcoinjs-lib'),
  Psbt: {
    fromBase64: (...args: any[]) => fromBase64Mock(...args),
  },
}))

const verifyPSBTMock = jest.fn()
jest.mock('../../views/contract/helpers/verifyPSBT', () => ({
  verifyPSBT: (...args: any[]) => verifyPSBTMock(...args),
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
    releasePsbt: 'releasePsbt',
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
    expect(fromBase64Mock).toHaveBeenCalledWith(mockContract.releasePsbt, { network: networks.regtest })
    expect(finalizeInputMock).toHaveBeenCalled()
    expect(psbt.extractTransaction).toHaveBeenCalled()
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled()
  })
  it('should sign valid release transaction for legacy contracts', () => {
    const legacyContract: Partial<Contract> = {
      ...mockContract,
      releaseTransaction: mockContract.releasePsbt,
      releasePsbt: undefined,
    }
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
    const [tx, error] = verifyAndSignReleaseTx(legacyContract as Contract, mockSellOffer as SellOffer, wallet)

    expect(error).toBe(null)
    expect(tx).toEqual('transactionAsHex')
    expect(psbt.signInput).toHaveBeenCalled()
    expect(fromBase64Mock).toHaveBeenCalledWith(legacyContract.releaseTransaction, { network: networks.regtest })
    expect(finalizeInputMock).toHaveBeenCalled()
    expect(psbt.extractTransaction).toHaveBeenCalled()
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled()
  })
})
