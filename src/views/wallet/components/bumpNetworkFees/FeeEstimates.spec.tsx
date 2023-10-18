import ShallowRenderer from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { FeeEstimates } from './FeeEstimates'

describe('FeeEstimates', () => {
  const renderer = ShallowRenderer.createRenderer()
  const setFeeMock = jest.fn()
  const estimatedFees = {
    fastestFee: 10,
    halfHourFee: 7,
    hourFee: 3,
    economyFee: 1,
    minimumFee: 1,
  }
  it('renders correctly', () => {
    renderer.render(<FeeEstimates estimatedFees={estimatedFees} setFeeRate={setFeeMock} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly if overpaying', () => {
    renderer.render(<FeeEstimates estimatedFees={estimatedFees} setFeeRate={setFeeMock} isOverpaying />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('sets fees on press', () => {
    const { getByText } = render(<FeeEstimates estimatedFees={estimatedFees} setFeeRate={setFeeMock} />)
    fireEvent(getByText('next block'), 'onPress')
    expect(setFeeMock).toHaveBeenCalledWith('10')
    fireEvent(getByText('~ 30 min'), 'onPress')
    expect(setFeeMock).toHaveBeenCalledWith('7')
    fireEvent(getByText('~ 1 hour'), 'onPress')
    expect(setFeeMock).toHaveBeenCalledWith('3')
  })
})
