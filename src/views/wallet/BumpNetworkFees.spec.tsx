import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { NavigationWrapper, navigationMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import { placeholderFees } from '../../hooks/query/useFeeEstimate'
import { getTransactionFeeRate } from '../../utils/bitcoin'
import { BumpNetworkFees } from './BumpNetworkFees'

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: () => navigationMock,
}))

const setNewFeeRateMock = jest.fn()
const bumpFeesMock = jest.fn()
const bumpNetworkFeesSetupReturnValue = {
  txId: bitcoinTransaction.txid,
  transaction: bitcoinTransaction,
  currentFee: getTransactionFeeRate(bitcoinTransaction),
  newFeeRate: undefined,
  setNewFeeRate: setNewFeeRateMock,
  newFeeRateIsValid: false,
  newFeeRateErrors: [],
  estimatedFees: placeholderFees,
  overpayingBy: 0.5,
}

const useBumpNetworkFeesSetupMock = jest.fn().mockReturnValue(bumpNetworkFeesSetupReturnValue)
jest.mock('./hooks/useBumpNetworkFeesSetup', () => ({
  useBumpNetworkFeesSetup: () => useBumpNetworkFeesSetupMock(),
}))
const useBumpFeesMock = jest.fn().mockReturnValue(bumpFeesMock)
jest.mock('./hooks/useBumpFees', () => ({
  useBumpFees: () => useBumpFeesMock(),
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
      newFeeRate: '20',
      newFeeRateIsValid: true,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when new fee is invalid', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFeeRate: '1',
      newFeeRateIsValid: false,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when user would be overpaying by at least 100%', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFeeRate: String(bumpNetworkFeesSetupReturnValue.currentFee * 3),
      overpayingBy: 2,
      newFeeRateIsValid: true,
    })
    renderer.render(<BumpNetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('new fee input changes fee value', () => {
    const newFeeRate = 20
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFeeRate: String(bumpNetworkFeesSetupReturnValue.currentFee * 3),
      newFeeRateIsValid: true,
    })
    const { getByPlaceholderText } = render(<BumpNetworkFees />, { wrapper: NavigationWrapper })
    fireEvent(getByPlaceholderText(''), 'onChange', String(newFeeRate))
    expect(setNewFeeRateMock).toHaveBeenCalledWith(String(newFeeRate))
  })
  it('calls bump fees', () => {
    useBumpNetworkFeesSetupMock.mockReturnValueOnce({
      ...bumpNetworkFeesSetupReturnValue,
      newFeeRate: '20',
      newFeeRateIsValid: true,
    })
    const { getByText } = render(<BumpNetworkFees />, { wrapper: NavigationWrapper })
    fireEvent(getByText('confirm'), 'onPress')
    expect(bumpFeesMock).toHaveBeenCalled()
  })
})
