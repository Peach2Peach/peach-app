import { createRenderer } from 'react-test-renderer/shallow'
import { getBuyOfferDraft } from '../../../tests/unit/data/offerDraftData'
import Summary from './Summary'

const releaseAddress = 'releaseAddress'
const walletLabel = 'walletLabel'
const goToSetupRefundWallet = jest.fn()
const publishOffer = jest.fn()

const useBuySummarySetupMock = jest.fn().mockReturnValue({
  releaseAddress,
  walletLabel,
  goToSetupRefundWallet,
  canPublish: true,
  publishOffer,
  isPublishing: false,
})
jest.mock('./hooks/useBuySummarySetup', () => ({
  useBuySummarySetup: (...args: any[]) => useBuySummarySetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('Summary', () => {
  const offerDraft = getBuyOfferDraft()
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
