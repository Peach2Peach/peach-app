import { createRenderer } from 'react-test-renderer/shallow'
import { NewBadge } from './NewBadge'

const useNewBadgeSetupMock = jest.fn().mockReturnValue({
  badge: 'fastTrader',
  icon: 'zapCircleInverted',
  goToProfile: jest.fn(),
  close: jest.fn(),
})
jest.mock('./hooks/useNewBadgeSetup', () => ({
  useNewBadgeSetup: () => useNewBadgeSetupMock(),
}))

describe('NewBadge', () => {
  const shallowRenderer = createRenderer()

  it('renders correctly', () => {
    shallowRenderer.render(<NewBadge />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
