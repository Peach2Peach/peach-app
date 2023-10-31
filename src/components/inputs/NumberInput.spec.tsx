import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from 'test-utils'
import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<NumberInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should enforce number format on change', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <NumberInput decimals={2} placeholder="placeholder" onChange={onChangeMock} />,
    )
    const input = getByPlaceholderText('placeholder')
    act(() => {
      fireEvent.changeText(input, '1,523')
    })
    expect(onChangeMock).toHaveBeenLastCalledWith('1.52')
  })
  it('should enforce phone number format on submit', () => {
    const onSubmitMock = jest.fn()
    const { getByPlaceholderText } = render(<NumberInput placeholder="placeholder" onSubmit={onSubmitMock} />)
    const input = getByPlaceholderText('placeholder')
    act(() => {
      fireEvent(input, 'onSubmit', '6sd0')
    })
    expect(onSubmitMock).toHaveBeenLastCalledWith('60')
  })
})
