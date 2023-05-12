import { createRenderer } from 'react-test-renderer/shallow'
import { contract } from '../../../tests/unit/data/contractData'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'

jest.mock('../../components/inputs', () => ({
  SlideToUnlock: 'SlideToUnlock',
}))

const wrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)

describe('ResolveDisputeSliders', () => {
  const shallowRender = createRenderer()
  it('should render correctly', () => {
    shallowRender.render(<ResolveDisputeSliders contract={contract} />, { wrapper })
    expect(shallowRender.getRenderOutput()).toMatchSnapshot()
  })
})
