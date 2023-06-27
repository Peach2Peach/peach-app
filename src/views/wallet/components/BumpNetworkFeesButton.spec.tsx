import ShallowRenderer from 'react-test-renderer/shallow'
import { BumpNetworkFeesButton } from './BumpNetworkFeesButton'
import { bitcoinTransaction } from '../../../../tests/unit/data/transactionDetailData'
import { fireEvent, render } from '@testing-library/react-native'

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
  it('calls bump fees', () => {
    const { getByText } = render(
      <BumpNetworkFeesButton transaction={bitcoinTransaction} newFeeRate="3" sendingAmount={4000} />,
    )
    fireEvent.press(getByText('confirm'))
    expect(bumpFeesMock).toHaveBeenCalled()
  })
})
