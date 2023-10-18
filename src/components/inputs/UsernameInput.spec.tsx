import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { UsernameInput } from './UsernameInput'

describe('UsernameInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<UsernameInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce username format when onEndEditing is called', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <UsernameInput onChange={onChangeMock} placeholder="form.username.placeholder" />,
    )
    const input = getByPlaceholderText('form.username.placeholder')
    fireEvent(input, 'onEndEditing', { nativeEvent: { text: 'Satoshi!' } })
    expect(onChangeMock).toHaveBeenLastCalledWith('@satoshi')
  })
  it('should enforce username format when onSubmit is called', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(
      <UsernameInput onSubmit={onSubmitMock} placeholder="form.username.placeholder" />,
    )
    const input = getByPlaceholderText('form.username.placeholder')
    fireEvent(input, 'onSubmit', 'Satoshi!')
    expect(onSubmitMock).toHaveBeenLastCalledWith('@satoshi')
  })
})
