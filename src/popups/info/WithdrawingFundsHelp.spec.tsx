import ShallowRenderer from 'react-test-renderer/shallow'
import { WithdrawingFundsHelp } from './WithdrawingFundsHelp'
import { fireEvent, render } from '@testing-library/react-native'
import { Linking } from 'react-native'

describe('WithdrawingFundsHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<WithdrawingFundsHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens link to buying a bitbox', () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL')
    const { getByText } = render(<WithdrawingFundsHelp />)
    fireEvent(getByText('BitBox hardware wallet'), 'onPress')
    expect(openURLSpy).toHaveBeenCalledWith('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')
  })
})
