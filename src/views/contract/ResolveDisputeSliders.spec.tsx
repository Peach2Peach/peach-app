import { render } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'

jest.mock('../../components/inputs', () => ({
  ConfirmSlider: 'ConfirmSlider',
}))

const wrapper = NavigationAndQueryClientWrapper

jest.mock('./context', () => ({
  useContractContext: jest.fn(() => ({ contract: {} })),
}))

describe('ResolveDisputeSliders', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ResolveDisputeSliders />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
