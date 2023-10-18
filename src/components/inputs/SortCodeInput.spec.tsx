import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { SortCodeInput } from './SortCodeInput'

describe('SortCodeInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<SortCodeInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce sort code format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<SortCodeInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.ukSortCode.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', '1  2 345  6a')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('123456')
  })
  it('should enforce sort code format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<SortCodeInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.ukSortCode.placeholder'))
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: '1  2 345  6a' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('123456')
  })
})
