import { account1 } from '../../../tests/unit/data/accountData'
import { setAccount } from '../account'
import { createUserRating } from './createUserRating'

const signMock = jest.fn().mockReturnValue(Buffer.from('abc'))
const keyPairMock = {
  sign: signMock,
}

const getPeachAccountMock = jest
  .spyOn(jest.requireMock('../peachAPI/peachAccount'), 'getPeachAccount')
  .mockReturnValue(keyPairMock)

jest.mock('../wallet/getWallet', () => ({
  getWallet: jest.fn(),
}))

const getMainAccountMock = jest.fn().mockReturnValue(keyPairMock)
jest.mock('../account/getMainAccount', () => ({
  getMainAccount: () => getMainAccountMock(),
}))

describe('createUserRating', () => {
  const userId = '123'
  const rating = 1

  beforeEach(() => {
    setAccount({ ...account1, publicKey: 'publicKey' })
  })

  it('creates a rating with correct signature by using peach account', () => {
    const ratingObj = createUserRating(userId, rating)

    expect(ratingObj.creationDate).toBeInstanceOf(Date)
    expect(ratingObj.rating).toBe(rating)
    expect(ratingObj.ratedBy).toBe('publicKey')
    expect(ratingObj.signature).toBe('616263')
    expect(signMock).toHaveBeenCalledWith(expect.any(Buffer))
    expect(signMock.mock.calls[0][0].toString('hex')).toBe(
      'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    )
  })

  it('creates a rating with correct signature by using main address', () => {
    getPeachAccountMock.mockReturnValueOnce(undefined)
    const ratingObj = createUserRating(userId, rating)
    expect(ratingObj.creationDate).toBeInstanceOf(Date)
    expect(ratingObj.rating).toBe(rating)
    expect(ratingObj.ratedBy).toBe('publicKey')
    expect(ratingObj.signature).toBe('616263')
    expect(signMock).toHaveBeenCalledWith(expect.any(Buffer))
    expect(signMock.mock.calls[0][0].toString('hex')).toBe(
      'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    )
  })
})
