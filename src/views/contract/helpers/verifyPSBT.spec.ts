import { configStore } from '../../../store/configStore'
import { verifyPSBT } from './verifyPSBT'

const txIdPartOfPSBTMock = jest.fn()
jest.mock('../../../utils/bitcoin', () => ({
  txIdPartOfPSBT: (...args: any) => txIdPartOfPSBTMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('verifyPSBT', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should handle missing data', () => {
    const mockPsbt = 'somePsbt'
    const mockSellOffer = undefined
    const mockContract = {}

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('MISSING_DATA')
    const mockSellOfferWithoutFunding = {
      funding: {
        txIds: undefined,
      },
    }

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOfferWithoutFunding, mockContract)).toBe('MISSING_DATA')
  })
  it('should handle invalid funding inputs', () => {
    const mockPsbt = 'somePsbt'
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {}
    txIdPartOfPSBTMock.mockReturnValueOnce(false)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('INVALID_INPUT')
  })

  it('should handle invalid return address', () => {
    const mockPsbt = {
      txOutputs: [
        {
          address: 'invalidReleaseAddress',
          value: 100,
        },
      ],
    }
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 100,
    }
    txIdPartOfPSBTMock.mockReturnValueOnce(true)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('RETURN_ADDRESS_MISMATCH')
  })

  it('should handle missing peachFee', () => {
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 100,
        },
      ],
    }
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 100,
    }
    txIdPartOfPSBTMock.mockReturnValueOnce(true)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('INVALID_OUTPUT')
  })

  it('should handle invalid peach fee', () => {
    configStore.setState((state) => ({ ...state, peachFee: 0.02 }))
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 100,
        },
        {
          address: 'peachAddress',
          value: 10,
        },
      ],
    }
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 100,
    }

    txIdPartOfPSBTMock.mockReturnValueOnce(true)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('INVALID_OUTPUT')
  })

  it('should handle invalid buyer output', () => {
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 0,
        },
        {
          address: 'peachAddress',
          value: 20000,
        },
      ],
    }
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
    }

    txIdPartOfPSBTMock.mockReturnValue(true)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('INVALID_OUTPUT')
  })

  it('should handle invalid buyer output when there\'s no peach fee', () => {
    configStore.setState((state) => ({ ...state, peachFee: 0 }))
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 0,
        },
      ],
    }
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
    }

    txIdPartOfPSBTMock.mockReturnValueOnce(true)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('INVALID_OUTPUT')
  })

  it('should handle valid psbt', () => {
    configStore.setState((state) => ({ ...state, peachFee: 0.02 }))
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 980000,
        },
        {
          address: 'peachAddress',
          value: 20000,
        },
      ],
    }
    const mockSellOffer = {
      funding: {
        txIds: ['someId'],
      },
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
    }

    txIdPartOfPSBTMock.mockReturnValue(true)

    // @ts-expect-error
    expect(verifyPSBT(mockPsbt, mockSellOffer, mockContract)).toBe('')
  })
})
