import { act, fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../utils/i18n'
import { BankNumberInput } from './BankNumberInput'

describe('BankNumberInput', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BankNumberInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce bank number format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<BankNumberInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.account.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', '12 34 56 78')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('12345678')
  })
  it('should enforce bank number format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<BankNumberInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.account.placeholder'))
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: '12 34 56 78' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('12345678')
  })
})
