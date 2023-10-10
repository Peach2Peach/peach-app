import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { NetworkFees } from './NetworkFees'

const useNetworkFeesSetupMock = jest.fn().mockReturnValue({
  estimatedFees: {
    fastestFee: 5,
    halfHourFee: 4,
    hourFee: 3,
    economyFee: 2,
    minimumFee: 1,
  },
  selectedFeeRate: 'fastestFee',
  setSelectedFeeRate: jest.fn(),
  customFeeRate: 5,
  setCustomFeeRate: jest.fn(),
  submit: jest.fn(),
  isValid: true,
  feeRateSet: false,
})
jest.mock('./hooks/useNetworkFeesSetup', () => ({
  useNetworkFeesSetup: () => useNetworkFeesSetupMock(),
}))

describe('NetworkFees', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NetworkFees />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
