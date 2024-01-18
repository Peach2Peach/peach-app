import { Psbt, networks } from 'bitcoinjs-lib'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { SIGHASH } from '../bitcoin/constants'
import { getEscrowWalletForOffer } from '../wallet/getEscrowWalletForOffer'
import { setWallet } from '../wallet/setWallet'
import { verifyAndSignReleaseTx } from './verifyAndSignReleaseTx'

const fromBase64Mock = jest.fn()
jest.mock('bitcoinjs-lib', () => ({
  ...jest.requireActual('bitcoinjs-lib'),
  Psbt: {
    fromBase64: (...args: unknown[]) => fromBase64Mock(...args),
  },
}))

const verifyReleasePSBTMock = jest.fn()
jest.mock('../../views/contract/helpers/verifyReleasePSBT', () => ({
  verifyReleasePSBT: (...args: unknown[]) => verifyReleasePSBTMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('verifyAndSignReleaseTx', () => {
  const amount = 10000
  const mockSellOffer = {
    id: '12',
    funding: { txIds: ['txid1'], vouts: [0], amounts: [amount] },
    amount,
  }
  const mockContract: Partial<Contract> = {
    id: '12-13',
    symmetricKeyEncrypted: 'mockSymmetricKeyEncrypted',
    symmetricKeySignature: 'mockSymmetricKeySignature',
    buyer: { id: 'mockBuyerId', pgpPublicKey: 'mockPgpPublicKey' } as User,
    seller: { id: 'mockSellerId' } as User,
    releasePsbt: 'releasePsbt',
  }
  const contractWithBatching = { ...mockContract, batchReleasePsbt: 'batchReleasePsbt' }
  const finalizeInputMock = jest.fn()

  const psbt: Partial<Psbt> = {
    data: { inputs: [{ sighashType: SIGHASH.ALL }] } as Psbt['data'],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    extractTransaction: jest.fn().mockReturnValue({
      toHex: jest.fn().mockReturnValue('transactionAsHex'),
    }),
    txInputs: [{}] as Psbt['txInputs'],
    txOutputs: [
      { address: 'address1', value: 9000 },
      { address: 'address2', value: 1000 },
    ] as Psbt['txOutputs'],
  }
  const batchPsbt: Partial<Psbt> = {
    data: { inputs: [{ sighashType: SIGHASH.SINGLE_ANYONECANPAY }] } as Psbt['data'],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    toBase64: jest.fn().mockReturnValue('batchTransactionAsBase64'),
    txInputs: [{}] as Psbt['txInputs'],
    txOutputs: [{ address: 'address1', value: 9000 }] as Psbt['txOutputs'],
  }
  fromBase64Mock.mockImplementation((base64) => (base64 === mockContract.releasePsbt ? psbt : batchPsbt))
  setWallet(createTestWallet())

  const wallet = getEscrowWalletForOffer(mockSellOffer as SellOffer)

  it('should return null and error message if sell offer id is found', () => {
    const { errorMsg } = verifyAndSignReleaseTx(mockContract as Contract, {} as SellOffer, wallet)
    expect(errorMsg).toBe('SELL_OFFER_NOT_FOUND')
  })
  it('should return null and error message if sell offer funding is found', () => {
    const { errorMsg } = verifyAndSignReleaseTx(
      mockContract as Contract,
      { ...mockSellOffer, funding: undefined } as unknown as SellOffer,
      wallet,
    )
    expect(errorMsg).toBe('SELL_OFFER_NOT_FOUND')
  })
  it('should return null and error message if psbt is not valid', () => {
    verifyReleasePSBTMock.mockReturnValueOnce('INVALID_INPUT')

    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      mockContract as Contract,
      mockSellOffer as SellOffer,
      wallet,
    )

    expect(releaseTransaction).toBe(undefined)
    expect(batchReleasePsbt).toBe(undefined)
    expect(errorMsg).toBe('INVALID_INPUT')
  })
  it('should sign valid release transaction and return it', () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      mockContract as Contract,
      mockSellOffer as SellOffer,
      wallet,
    )

    expect(errorMsg).toBe(undefined)
    expect(releaseTransaction).toEqual('transactionAsHex')
    expect(batchReleasePsbt).toEqual(undefined)
    expect(psbt.signInput).toHaveBeenCalled()
    expect(fromBase64Mock).toHaveBeenCalledWith(mockContract.releasePsbt, { network: networks.regtest })
    expect(finalizeInputMock).toHaveBeenCalled()
    expect(psbt.extractTransaction).toHaveBeenCalled()
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled()
  })
  it('should return null and error message if batch psbt is not valid', () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    verifyReleasePSBTMock.mockReturnValueOnce('INVALID_INPUT')

    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      contractWithBatching as Contract,
      mockSellOffer as SellOffer,
      wallet,
    )

    expect(releaseTransaction).toBe(undefined)
    expect(batchReleasePsbt).toBe(undefined)
    expect(errorMsg).toBe('INVALID_INPUT')
  })
  it('should return null and error message if batch psbt is valid but not for batching', () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    fromBase64Mock.mockReturnValueOnce(psbt)
    fromBase64Mock.mockReturnValueOnce(psbt)

    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      contractWithBatching as Contract,
      mockSellOffer as SellOffer,
      wallet,
    )

    expect(releaseTransaction).toBe(undefined)
    expect(batchReleasePsbt).toBe(undefined)
    expect(errorMsg).toBe('Transaction is not for batching')
  })
  it('should sign release transaction and batch release transaction', () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    verifyReleasePSBTMock.mockReturnValueOnce(null)
    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      contractWithBatching as Contract,
      mockSellOffer as SellOffer,
      wallet,
    )

    expect(errorMsg).toBe(undefined)
    expect(releaseTransaction).toEqual('transactionAsHex')
    expect(batchReleasePsbt).toEqual('batchTransactionAsBase64')
    expect(psbt.signInput).toHaveBeenCalled()
  })
})
