import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, resetMock } from '../../tests/unit/helpers/NavigationWrapper'
import { useDynamicLinks } from './useDynamicLinks'
import { defaultAccount, setAccount } from '../utils/account'
import { account1 } from '../../tests/unit/data/accountData'

let onLinkHandlers: Function[] = []
const dynamicLink = { url: 'https://peachbitcoin.com/referral/?code=SATOSHI' }
const onLinkMock = jest.fn().mockImplementation((cb) => {
  onLinkHandlers.push(cb)
})

const getInitialLinkMock = jest.fn().mockResolvedValue(dynamicLink)
jest.mock('@react-native-firebase/dynamic-links', () => () => ({
  onLink: (...args: any[]) => onLinkMock(...args),
  getInitialLink: () => getInitialLinkMock(),
}))

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
    getInitialLinkMock.mockResolvedValueOnce(null)
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
