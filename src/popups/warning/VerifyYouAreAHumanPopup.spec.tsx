import ShallowRenderer from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { Popup } from '../../components/popup/Popup'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import { VerifyYouAreAHuman, VerifyYouAreAHumanPopup } from './VerifyYouAreAHumanPopup'

const renderer = ShallowRenderer.createRenderer()

const WebViewMock = jest.fn()
jest.mock('react-native-webview', () => ({
  WebView: (...args: unknown[]) => WebViewMock(...args),
}))

const initAppMock = jest.fn()
jest.mock('../../init/initApp', () => ({
  initApp: (...args: unknown[]) => initAppMock(...args),
}))

describe('VerifyYouAreAHumanPopup', () => {
  it('renders correctly', () => {
    renderer.render(<VerifyYouAreAHumanPopup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('shows challenge popup', () => {
    const { getByText, UNSAFE_queryByType } = render(
      <>
        <VerifyYouAreAHumanPopup />
        <Popup />
      </>,
    )

    fireEvent.press(getByText('verify'))

    expect(UNSAFE_queryByType(VerifyYouAreAHuman)).toBeTruthy()
  })
})
describe('VerifyYouAreAHuman', () => {
  it('renders correctly', () => {
    renderer.render(<VerifyYouAreAHuman />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('sets cloudflare challenge from webview', async () => {
    const cloudflareChallenge = {
      cfClearance: 'cfClearance',
      userAgent: 'userAgent',
    }
    render(<VerifyYouAreAHuman />)
    await WebViewMock.mock.calls[0][0].onMessage({ nativeEvent: { data: JSON.stringify(cloudflareChallenge) } })
    expect(useSettingsStore.getState().cloudflareChallenge).toEqual(cloudflareChallenge)
    expect(initAppMock).toHaveBeenCalled()
  })
})
