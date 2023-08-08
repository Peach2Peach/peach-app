import { act, fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../utils/i18n'
import { CVUInput } from './CVUInput'

describe('CVUInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<CVUInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is optional when specified', () => {
    renderer.render(<CVUInput required={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is neither optional nor required when specified', () => {
    renderer.render(<CVUInput required={undefined} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should enforce cvu format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<CVUInput onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText(i18n('form.cvu.placeholder'))
    act(() => {
      fireEvent(input, 'onSubmit', '12 3 45 a')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('12345')
  })
  it('should enforce cCVUvu format on end editing', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(<CVUInput onChange={onChangeMock} />)
    const input = getByPlaceholderText(i18n('form.cvu.placeholder'))
    act(() => {
      fireEvent(input, 'onEndEditing', { nativeEvent: { text: '12 3 45 a' } })
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('12345')
  })
})