import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { EmailInput } from './EmailInput'

describe('EmailInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<EmailInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce email format when onEndEditing is called', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<EmailInput onChangeText={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.email.placeholder'))
    fireEvent(input, 'onEndEditing', { nativeEvent: { text: 'SaTOSHI@gmx.com' } })
    expect(onChangeMock).toHaveBeenLastCalledWith('satoshi@gmx.com')
  })
})
