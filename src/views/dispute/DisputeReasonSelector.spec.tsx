import { createRenderer } from 'react-test-renderer/shallow'
import { DisputeReasonSelector } from './DisputeReasonSelector'
import { disputeReasons } from './hooks/disputeReasons'

const setReasonMock = jest.fn()
const useDisputeReasonSelectorSetupMock = jest.fn().mockReturnValue({
  availableReasons: disputeReasons.buyer,
  setReason: setReasonMock,
})
jest.mock('./hooks/useDisputeReasonSelectorSetup', () => ({
  useDisputeReasonSelectorSetup: () => useDisputeReasonSelectorSetupMock(),
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => ({
    params: {
      disputeType: 'buyer',
    },
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
