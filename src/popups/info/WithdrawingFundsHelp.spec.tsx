import { Linking } from 'react-native'
import ShallowRenderer from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { WithdrawingFundsHelp } from './WithdrawingFundsHelp'

describe('WithdrawingFundsHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<WithdrawingFundsHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens link to buying a bitbox', async () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL')
    const { getByText } = render(<WithdrawingFundsHelp />)
    await fireEvent(getByText('BitBox hardware wallet'), 'onPress')
    expect(openURLSpy).toHaveBeenCalledWith('https://bitbox.swiss/bitbox02/?ref=DLX6l9ccCc')
  })
})
