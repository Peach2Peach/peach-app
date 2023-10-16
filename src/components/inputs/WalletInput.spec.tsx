import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { WalletInput } from './WalletInput'

describe('WalletInput', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<WalletInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should enforce wallet format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<WalletInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.wallet.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', 'my-wallet-input')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('MYWALLETINPUT')
  })

  it('should enforce wallet format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<WalletInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.wallet.placeholder'))
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: 'my-wallet-input' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('MYWALLETINPUT')
  })
})
