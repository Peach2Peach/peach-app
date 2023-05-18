import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'

jest.mock('../../components/inputs', () => ({
  SlideToUnlock: 'SlideToUnlock',
}))

const wrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)

describe('ResolveDisputeSliders', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ResolveDisputeSliders contract={{} as Contract} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
