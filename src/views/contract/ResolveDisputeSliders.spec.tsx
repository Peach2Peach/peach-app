import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'

jest.mock('../../components/inputs', () => ({
  ConfirmSlider: 'ConfirmSlider',
}))

const wrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)

jest.mock('./context', () => ({
  useContractContext: jest.fn(() => ({ contract: {} })),
}))

describe('ResolveDisputeSliders', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ResolveDisputeSliders />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
