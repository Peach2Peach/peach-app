import { createRenderer } from 'react-test-renderer/shallow'
import { CustomSelector } from './CustomSelector'
import { Text } from '../../text'
import { fireEvent, render } from '@testing-library/react-native'

describe('CustomSelector', () => {
  const renderer = createRenderer()
  const items = [
    { value: 1, display: <Text>one</Text> },
    { value: 2, display: <Text>two</Text> },
    { value: 3, display: <Text>three</Text> },
  ]
  const onChange = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render correctly', () => {
    renderer.render(
      <CustomSelector
        {...{
          items,
          selectedValue: 1,
          onChange,
          disabled: false,
        }}
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when disabled', () => {
    renderer.render(
      <CustomSelector
        {...{
          items,
          selectedValue: 1,
          onChange,
          disabled: true,
        }}
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should select item', () => {
    const { getByText } = render(
      <CustomSelector
        {...{
          items,
          selectedValue: 1,
          onChange,
          disabled: false,
        }}
      />,
    )
    fireEvent(getByText('two'), 'onPress')
    expect(onChange).toHaveBeenCalledWith(2)
  })
  it('should not select item when disabled', () => {
    const { getByText } = render(
      <CustomSelector
        {...{
          items,
          selectedValue: 1,
          onChange,
          disabled: true,
        }}
      />,
    )
    fireEvent(getByText('two'), 'onPress')
    expect(onChange).not.toHaveBeenCalled()
  })
})
