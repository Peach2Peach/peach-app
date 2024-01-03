import ShallowRenderer from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { NewFee } from './NewFee'

describe('NewFee', () => {
  const setNewFeeRateMock = jest.fn()
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<NewFee newFeeRate="1" setNewFeeRate={setNewFeeRateMock} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when overpaying', () => {
    renderer.render(<NewFee newFeeRate="2" overpayingBy={1} setNewFeeRate={setNewFeeRateMock} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('sets new fee', () => {
    const newFee = '2'
    const { getByPlaceholderText } = render(<NewFee newFeeRate="1" setNewFeeRate={setNewFeeRateMock} />)
    fireEvent(getByPlaceholderText(''), 'onChangeText', newFee)
    expect(setNewFeeRateMock).toHaveBeenCalledWith(newFee)
  })
})
