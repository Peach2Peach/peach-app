import OpenPGP from 'react-native-fast-openpgp'
import { verify } from '../../../../src/utils/pgp'

jest.mock('react-native-fast-openpgp', () => ({
  verify: jest.fn(),
}))

describe('verify', () => {
  beforeEach(() => {
    // Reset mocks before each test case
    jest.resetAllMocks()
  })

  it('verifies the signature of the message', async () => {
    ;(<jest.Mock>OpenPGP.verify).mockResolvedValueOnce(true)
    const result = await verify('signature', 'message', 'publicKey')
    expect(OpenPGP.verify).toHaveBeenCalledWith('signature', 'message', 'publicKey')
    expect(result).toEqual(true)
  })
})
