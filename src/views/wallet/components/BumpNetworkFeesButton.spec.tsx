import ShallowRenderer from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { bitcoinTransaction } from '../../../../tests/unit/data/transactionDetailData'
import tw from '../../../styles/tailwind'
import { BumpNetworkFeesButton } from './BumpNetworkFeesButton'

const bumpFeesMock = jest.fn()
const useBumpFeesMock = jest.fn().mockReturnValue(bumpFeesMock)
jest.mock('../hooks/useBumpFees', () => ({
  useBumpFees: () => useBumpFeesMock(),
}))
describe('BumpNetworkFeesButton', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<BumpNetworkFeesButton transaction={bitcoinTransaction} newFeeRate="3" sendingAmount={4000} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with style', () => {
    renderer.render(
      <BumpNetworkFeesButton style={tw`pb-5`} transaction={bitcoinTransaction} newFeeRate="3" sendingAmount={4000} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(
      <BumpNetworkFeesButton transaction={bitcoinTransaction} newFeeRate="3" sendingAmount={4000} disabled />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('calls bump fees', () => {
    const { getByText } = render(
      <BumpNetworkFeesButton transaction={bitcoinTransaction} newFeeRate="3" sendingAmount={4000} />,
    )
    fireEvent.press(getByText('confirm'))
    expect(bumpFeesMock).toHaveBeenCalled()
  })
  it('does not call bump fees when disabled', () => {
    const { getByText } = render(
      <BumpNetworkFeesButton transaction={bitcoinTransaction} newFeeRate="3" sendingAmount={4000} disabled />,
    )
    fireEvent.press(getByText('confirm'))
    expect(bumpFeesMock).not.toHaveBeenCalled()
  })
})
