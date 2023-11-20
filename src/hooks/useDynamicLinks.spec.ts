import { Linking } from 'react-native'
import { renderHook, waitFor } from 'test-utils'
import { account1 } from '../../tests/unit/data/accountData'
import { resetMock } from '../../tests/unit/helpers/NavigationWrapper'
import { defaultAccount, setAccount } from '../utils/account'
import { useDynamicLinks } from './useDynamicLinks'

const removeMock = jest.fn()
let onLinkHandlers: Function[] = []
// @ts-ignore
jest.spyOn(Linking, 'addEventListener').mockImplementation((type, cb) => {
  onLinkHandlers.push(cb)
  return { remove: removeMock }
})

const dynamicLink = 'https://peachbitcoin.page.link/?link=https%3A%2F%2Fpeachbitcoin.com%2Freferral%3Fcode%3DSATOSHI'
const getInitialURLSpy = jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(dynamicLink)

describe('useDynamicLinks', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
    onLinkHandlers = []
  })
  it('navigates to welcome screen w/ refCode if no user is registered & refCode exists', async () => {
    renderHook(useDynamicLinks)
    await waitFor(() =>
      expect(resetMock).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'welcome', params: { referralCode: 'SATOSHI' } }],
      }),
    )
  })
  it('does nothing if url does not exist', () => {
    getInitialURLSpy.mockResolvedValueOnce(null)
    renderHook(useDynamicLinks)
    expect(resetMock).not.toHaveBeenCalled()
  })
  it('does nothing if user already created account', () => {
    setAccount(account1)
    renderHook(useDynamicLinks)
    expect(resetMock).not.toHaveBeenCalled()
  })
  it('from fg state registers onLink handlers', () => {
    const { result } = renderHook(useDynamicLinks)
    expect(onLinkHandlers).toEqual([result.current])
  })
})
