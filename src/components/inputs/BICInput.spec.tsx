import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { BICInput } from './BICInput'

describe('BICInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<BICInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is optional when specified', () => {
    renderer.render(<BICInput required={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is neither optional nor required when specified', () => {
    renderer.render(<BICInput required={undefined} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should enforce BIC format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<BICInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.bic.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', 'deutdeff500')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('DEUT DE FF 500')
  })
  it('should enforce BIC format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<BICInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.bic.placeholder'))
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: 'deutdeff500' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('DEUT DE FF 500')
  })
})
