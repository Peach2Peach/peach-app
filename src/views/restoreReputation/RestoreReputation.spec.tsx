import { createRenderer } from 'react-test-renderer/shallow'
import { RestoreReputation } from './RestoreReputation'

const restoreReputationMock = jest.fn()
const useRestoreReputationSetupMock = jest.fn().mockReturnValue({
  restoreReputation: restoreReputationMock,
  isLoading: false,
  isRestored: false,
})
jest.mock('./hooks/useRestoreReputationSetup', () => ({
  useRestoreReputationSetup: () => useRestoreReputationSetupMock(),
}))
describe('RestoreReputation', () => {
  const shallowRenderer = createRenderer()

  it('should render correctly', () => {
    shallowRenderer.render(<RestoreReputation />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render Loading if isLoading is true', () => {
    useRestoreReputationSetupMock.mockReturnValueOnce({
      isLoading: true,
    })
    shallowRenderer.render(<RestoreReputation />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render ReputationRestored if isRestored is true', () => {
    useRestoreReputationSetupMock.mockReturnValueOnce({
      isRestored: true,
    })
    shallowRenderer.render(<RestoreReputation />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
