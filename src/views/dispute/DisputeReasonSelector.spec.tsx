import { createRenderer } from 'react-test-renderer/shallow'
import DisputeReasonSelector from './DisputeReasonSelector'
import { disputeReasons } from './hooks/disputeReasons'

const setReasonMock = jest.fn()
const useDisputeReasonSelectorSetupMock = jest.fn().mockReturnValue({
jest.mock('./hooks/useDisputeReasonSelectorSetup', () => ({
  useDisputeReasonSelectorSetup: jest.fn().mockReturnValue({
    availableReasons: disputeReasons.buyer,
    setReason: jest.fn(),
  }),
}))
describe('DisputeReasonSelector', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<DisputeReasonSelector />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
