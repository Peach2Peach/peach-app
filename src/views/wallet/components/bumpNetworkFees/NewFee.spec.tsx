import ShallowRenderer from 'react-test-renderer/shallow'
import { NewFee } from './NewFee'
import { fireEvent, render } from '@testing-library/react-native'

describe('NewFee', () => {
  const setNewFeeRateMock = jest.fn()
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<NewFee newFeeRate="1" setNewFeeRate={setNewFeeRateMock} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('sets new fee', () => {
    const newFee = '2'
    const { getByPlaceholderText } = render(<NewFee newFeeRate="1" setNewFeeRate={setNewFeeRateMock} />)
    fireEvent(getByPlaceholderText(''), 'onChange', newFee)
    expect(setNewFeeRateMock).toHaveBeenCalledWith(newFee)
  })
})