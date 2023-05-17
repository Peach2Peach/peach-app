import { createRenderer } from 'react-test-renderer/shallow'
import { CustomFeeItem } from './CustomFeeItem'
import { act, fireEvent, render } from '@testing-library/react-native'

describe('CustomFeeItem', () => {
  const renderer = createRenderer()

  const customFeeRate = '4'
  const setCustomFeeRate = jest.fn()
  it('renders correctly', () => {
    renderer.render(<CustomFeeItem {...{ customFeeRate, setCustomFeeRate }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(<CustomFeeItem {...{ customFeeRate, setCustomFeeRate, disabled: true }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('sets custom fee rate', () => {
    const { getByTestId } = render(<CustomFeeItem {...{ customFeeRate, setCustomFeeRate }} />)
    const input = getByTestId('input-custom-fees')
    act(() => {
      fireEvent(input, 'onChange', '60')
    })
    expect(setCustomFeeRate).toHaveBeenCalledWith('60')
  })
})
