import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import { CBUInput } from './CBUInput'

describe('CBUInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<CBUInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is optional when specified', () => {
    renderer.render(<CBUInput required={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is neither optional nor required when specified', () => {
    renderer.render(<CBUInput required={undefined} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should enforce CBU format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<CBUInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText('1112222344444444444445')
    act(() => {
      fireEvent(input, 'onSubmit', '12 3 45 a')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('12345')
  })
  it('should enforce CBU format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<CBUInput onChange={onChangeMock} />)
    const input = getByPlaceholderText('1112222344444444444445')
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: '12 3 45 a' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('12345')
  })
})
