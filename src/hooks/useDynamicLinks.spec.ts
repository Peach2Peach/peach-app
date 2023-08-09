import { renderHook, waitFor } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { account1 } from '../../tests/unit/data/accountData'
import { NavigationWrapper, resetMock } from '../../tests/unit/helpers/NavigationWrapper'
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

const wrapper = NavigationWrapper
describe('useDynamicLinks', () => {
  afterEach(() => {
    onLinkHandlers = []
    setAccount(defaultAccount)
  })
  it('navigates to welcome screen w/ refCode if no user is registered & refCode exists', async () => {
    renderHook(useDynamicLinks, { wrapper })
    await waitFor(() =>
      expect(resetMock).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'welcome', params: { referralCode: 'SATOSHI' } }],
      }),
    )
  })
  it('does nothing if url does not exist', () => {
    getInitialURLSpy.mockResolvedValueOnce(null)
    renderHook(useDynamicLinks, { wrapper })
    expect(resetMock).not.toHaveBeenCalled()
  })
  it('does nothing if user already created account', () => {
    setAccount(account1)
    renderHook(useDynamicLinks, { wrapper })
    expect(resetMock).not.toHaveBeenCalled()
  })
  it('from fg state registers onLink handlers', () => {
    const { result } = renderHook(useDynamicLinks, { wrapper })
    expect(onLinkHandlers).toEqual([result.current])
  })
})
