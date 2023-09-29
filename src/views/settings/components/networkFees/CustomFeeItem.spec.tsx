import { act, fireEvent, render } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { CustomFeeItem } from './CustomFeeItem'
expect.extend({ toMatchDiffSnapshot })

describe('CustomFeeItem', () => {
  const customFeeRate = '4'
  const setCustomFeeRate = jest.fn()
  const defaultComponent = <CustomFeeItem {...{ customFeeRate, setCustomFeeRate }} />
  it('renders correctly', () => {
    const { toJSON } = render(defaultComponent)
    const result = toJSON()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    const { toJSON } = render(<CustomFeeItem {...{ customFeeRate, setCustomFeeRate, disabled: true }} />)
    const result = toJSON()
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(result)
  })

  it('sets custom fee rate', () => {
    const { getByTestId } = render(defaultComponent)
    const input = getByTestId('input-custom-fees')
    act(() => {
      fireEvent.changeText(input, '60.23')
    })
    expect(setCustomFeeRate).toHaveBeenCalledWith('60.23')
  })
})
