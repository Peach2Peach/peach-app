import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import { CVUAliasInput } from './CVUAliasInput'

describe('CVUAliasInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<CVUAliasInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is optional when specified', () => {
    renderer.render(<CVUAliasInput required={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is neither optional nor required when specified', () => {
    renderer.render(<CVUAliasInput required={undefined} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should enforce cvu format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<CVUAliasInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText('12345678901234567890')
    act(() => {
      fireEvent(input, 'onSubmit', '12 3 45 a')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('12345')
  })
  it('should enforce CVU format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<CVUAliasInput onChange={onChangeMock} />)
    const input = getByPlaceholderText('12345678901234567890')
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: '12 3 45 a' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('12345')
  })
})
