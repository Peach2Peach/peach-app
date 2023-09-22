import { act, fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../utils/i18n'
import { PhoneInput } from './PhoneInput'

describe('PhoneInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<PhoneInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce phone number format on change', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<PhoneInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.phone.placeholder'))
    act(() => {
      fireEvent.changeText(input, '49-123 456789')
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('+49123456789')
  })
  it('should enforce phone number format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<PhoneInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.phone.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', '49-123 456789')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('+49123456789')
  })
})
