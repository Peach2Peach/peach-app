import { releaseTransactionHasValidOutputs } from './releaseTransactionHasValidOutputs'

// eslint-disable-next-line max-lines-per-function
describe('releaseTransactionHasValidOutputs', () => {
  it('should return false if peachFee output is missing', () => {
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 100,
        },
      ],
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 100,
    }

    // @ts-expect-error
    expect(releaseTransactionHasValidOutputs(mockPsbt, mockContract, 0.02)).toBeFalsy()
  })

  it('should return false if peachFee output is wrong', () => {
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
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 100,
    }

    // @ts-expect-error
    expect(releaseTransactionHasValidOutputs(mockPsbt, mockContract, 0.02)).toBeFalsy()
  })

  it('should return false if buyer output is wrong', () => {
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
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
    }

    // @ts-expect-error
    expect(releaseTransactionHasValidOutputs(mockPsbt, mockContract, 0.02)).toBeFalsy()
  })

  it('should return false if buyer output is wrong and no fees', () => {
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 0,
        },
      ],
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
    }

    // @ts-expect-error
    expect(releaseTransactionHasValidOutputs(mockPsbt, mockContract, 0)).toBeFalsy()
  })

  it('should return true for valid PSBTs', () => {
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
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
    }

    // @ts-expect-error
    expect(releaseTransactionHasValidOutputs(mockPsbt, mockContract, 0.02)).toBeTruthy()
  })

  it('should return true for valid PSBT and free trade for buyer', () => {
    const mockPsbt = {
      txOutputs: [
        {
          address: 'releaseAddress',
          value: 980000,
        },
      ],
    }
    const mockContract = {
      releaseAddress: 'releaseAddress',
      amount: 1000000,
      buyerFee: 0,
    }

    // @ts-expect-error
    expect(releaseTransactionHasValidOutputs(mockPsbt, mockContract, 0.02)).toBeTruthy()
  })
})
