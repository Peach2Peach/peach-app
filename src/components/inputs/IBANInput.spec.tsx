import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { IBANInput } from './IBANInput'

describe('IBANInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<IBANInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce IBAN format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<IBANInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.iban.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', 'DE89370400440532013000')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('DE89 3704 0044 0532 0130 00')
  })
  it('should enforce IBAN format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<IBANInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.iban.placeholder'))
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: 'DE89370400440532013000' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('DE89 3704 0044 0532 0130 00')
  })
})
