import { account } from '../../../../src/utils/account'
import { createUserRating } from '../../../../src/utils/contract'
import { getPeachAccount } from '../../../../src/utils/peachAPI/peachAccount'
import { getMainAddress } from '../../../../src/utils/wallet'

jest.mock('../../../../src/utils/account')
jest.mock('../../../../src/utils/peachAPI/peachAccount', () => ({
  getPeachAccount: jest.fn(),
}))
jest.mock('../../../../src/utils/wallet', () => ({
  getWallet: jest.fn(),
  getMainAddress: jest.fn(),
}))

describe('createUserRating', () => {
  const userId = '123'
  const rating = 1

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('creates a rating with correct signature by using peach account', () => {
    const keyPairMock = {
      sign: jest.fn().mockReturnValue(Buffer.from('abc')),
    }
    ;(getPeachAccount as jest.Mock).mockReturnValue(keyPairMock)
    account.publicKey = 'publicKey'

    const ratingObj = createUserRating(userId, rating)

    expect(ratingObj.creationDate).toBeInstanceOf(Date)
    expect(ratingObj.rating).toBe(rating)
    expect(ratingObj.ratedBy).toBe('publicKey')
    expect(ratingObj.signature).toBe('616263')
    expect(keyPairMock.sign).toHaveBeenCalledWith(expect.any(Buffer))
    expect(keyPairMock.sign.mock.calls[0][0].toString('hex')).toBe(
      'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    )
  })

  test('creates a rating with correct signature by using main address', () => {
    const keyPairMock = {
      sign: jest.fn().mockReturnValue(Buffer.from('abc')),
    }
    ;(getMainAddress as jest.Mock).mockReturnValue(keyPairMock)
    const ratingObj = createUserRating(userId, rating)
    expect(ratingObj.creationDate).toBeInstanceOf(Date)
    expect(ratingObj.rating).toBe(rating)
    expect(ratingObj.ratedBy).toBe('publicKey')
    expect(ratingObj.signature).toBe('616263')
    expect(keyPairMock.sign).toHaveBeenCalledWith(expect.any(Buffer))
    expect(keyPairMock.sign.mock.calls[0][0].toString('hex')).toBe(
      'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    )
  })
})
