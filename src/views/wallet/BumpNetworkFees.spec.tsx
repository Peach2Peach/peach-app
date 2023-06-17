import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import { placeholderFees } from '../../hooks/query/useFeeEstimate'
import { getTransactionFeeRate } from '../../utils/bitcoin'
import { BumpNetworkFees } from './BumpNetworkFees'

const setNewFeeMock = jest.fn()
const bumpFeesMock = jest.fn()
const bumpNetworkFeesSetupReturnValue = {
  txId: bitcoinTransaction.txid,
  transaction: bitcoinTransaction,
  currentFee: getTransactionFeeRate(bitcoinTransaction),
  newFee: undefined,
  setNewFee: setNewFeeMock,
  newFeeIsValid: false,
  newFeeErrors: [],
  estimatedFees: placeholderFees,
  overpayingBy: 0.5,
  bumpFees: bumpFeesMock,
}

const useBumpNetworkFeesSetupMock = jest.fn().mockReturnValue(bumpNetworkFeesSetupReturnValue)
jest.mock('./hooks/useBumpNetworkFeesSetup', () => ({
  useBumpNetworkFeesSetup: () => useBumpNetworkFeesSetupMock(),
}))
describe('BumpNetworkFees', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for medium screens', () => {
    mockDimensions({ width: 600, height: 840 })

    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly while still loading', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      transaction: undefined,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when new fee is valid', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFee: 20,
      newFeeIsValid: true,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when new fee is invalid', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFee: 1,
      newFeeIsValid: false,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when user would be overpaying by at least 100%', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFee: bumpNetworkFeesSetupReturnValue.currentFee * 3,
      overpayingBy: 2,
      newFeeIsValid: true,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('new fee input changes fee value', () => {
    const newFee = 20
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFee: bumpNetworkFeesSetupReturnValue.currentFee * 3,
      newFeeIsValid: true,
    })
    const { getByPlaceholderText } = render(<BumpNetworkFees />)
    fireEvent(getByPlaceholderText(''), 'onChange', newFee)
    expect(setNewFeeMock).toHaveBeenCalledWith(newFee)
  })
  it('calls bump fees', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFee: 20,
      newFeeIsValid: true,
    })
    const { getByText } = render(<BumpNetworkFees />)
    fireEvent(getByText('confirm'), 'onPress')
    expect(bumpFeesMock).toHaveBeenCalled()
  })
})
