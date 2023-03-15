import OpenPGP from 'react-native-fast-openpgp'
import { verify } from '.'

jest.mock('react-native-fast-openpgp', () => ({
  verify: jest.fn(),
}))

describe('verify', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('verifies the signature of the message', async () => {
    ;(<jest.Mock>OpenPGP.verify).mockResolvedValueOnce(true)
    const result = await verify('signature', 'message', 'publicKey')
    expect(OpenPGP.verify).toHaveBeenCalledWith('signature', 'message', 'publicKey')
    expect(result).toEqual(true)
  })
})
