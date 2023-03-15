import { getSellOfferFromContract, signReleaseTx } from '.'
import { verifyPSBT } from '../../views/contract/helpers/verifyPSBT'

jest.mock('./getSellOfferFromContract', () => ({
  getSellOfferFromContract: jest.fn(),
}))

const fromBase64Mock = jest.fn()
jest.mock('bitcoinjs-lib', () => ({
  ...jest.requireActual('bitcoinjs-lib'),
  Psbt: {
    fromBase64: () => fromBase64Mock(),
  },
}))
jest.mock('../../views/contract/helpers/verifyPSBT', () => ({
  verifyPSBT: jest.fn(),
}))
jest.mock('../wallet', () => ({
  getEscrowWallet: jest.fn(),
  getWallet: jest.fn(),
  getNetwork: jest.fn(),
}))

// eslint-disable-next-line max-lines-per-function
describe('signReleaseTx', () => {
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

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return null if the sell offer ID is not found', () => {
    ;(getSellOfferFromContract as jest.Mock).mockReturnValue({})

    const [tx, error] = signReleaseTx(mockContract as Contract)

    expect(tx).toBe(null)
    expect(error).toBe('SELL_OFFER_NOT_FOUND')
  })
  it('should return null and error message if psbt is not valid', () => {
    ;(getSellOfferFromContract as jest.Mock).mockReturnValue(mockSellOffer)
    ;(verifyPSBT as jest.Mock).mockReturnValue('INVALID_INPUT')

    const [tx, error] = signReleaseTx(mockContract as Contract)

    expect(tx).toBe(null)
    expect(error).toBe('INVALID_INPUT')
  })

  it('should sign valid release transaction and return it', () => {
    ;(getSellOfferFromContract as jest.Mock).mockReturnValue(mockSellOffer)
    const finalizeInputMock = jest.fn()
    const psbt = {
      signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
      extractTransaction: jest.fn().mockReturnValue({
        toHex: jest.fn().mockReturnValue('transactionAsHex'),
      }),
      txInputs: [{}],
      txOutputs: [
        {
          address: 'address1',
          value: 9000,
        },
        {
          address: 'address2',
          value: 1000,
        },
      ],
    }
    fromBase64Mock.mockReturnValue(psbt)
    ;(verifyPSBT as jest.Mock).mockReturnValue(null)
    const [tx, error] = signReleaseTx(mockContract as Contract)

    expect(error).toBe(null)
    expect(tx).toEqual('transactionAsHex')
    expect(psbt.signInput).toHaveBeenCalled()
    expect(finalizeInputMock).toHaveBeenCalled()
    expect(psbt.extractTransaction).toHaveBeenCalled()
    expect(psbt.extractTransaction().toHex).toHaveBeenCalled()
  })
})
