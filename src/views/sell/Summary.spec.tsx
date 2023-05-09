import { createRenderer } from 'react-test-renderer/shallow'
import { getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import Summary from './Summary'

const returnAddress = 'returnAddress'
const walletLabel = 'walletLabel'
const goToSetupRefundWallet = jest.fn()
const publishOffer = jest.fn()

const useSellSummarySetupMock = jest.fn().mockReturnValue({
  returnAddress,
  walletLabel,
  goToSetupRefundWallet,
  canPublish: true,
  publishOffer,
  isPublishing: false,
})
jest.mock('./hooks/useSellSummarySetup', () => ({
  useSellSummarySetup: (...args: any[]) => useSellSummarySetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('Summary', () => {
  const offerDraft = getSellOfferDraft()
  const setOfferDraft = jest.fn()
  const renderer = createRenderer()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the Summary view', () => {
    renderer.render(<Summary {...{ offerDraft, setOfferDraft }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
