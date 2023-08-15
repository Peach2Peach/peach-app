import { fireEvent, render } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { TogglePayoutPending } from './TogglePayoutPending'

const toggleShowBatchInfo = jest.fn()
const useContractContextMock = jest.fn().mockReturnValue({
  contract,
  showBatchInfo: false,
  toggleShowBatchInfo,
})
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('TogglePayoutPending', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<TogglePayoutPending />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call toggleShowBatchInfo', () => {
    const { getByText } = render(<TogglePayoutPending />)
    fireEvent.press(getByText('payout pending'))
    expect(toggleShowBatchInfo).toHaveBeenCalled()
  })
  it('should render correctly when showBatchInfo is true', () => {
    useContractContextMock.mockReturnValueOnce({
      contract,
      showBatchInfo: true,
      toggleShowBatchInfo,
    })
    const { toJSON } = render(<TogglePayoutPending />)
    expect(toJSON()).toMatchSnapshot()
  })
})
