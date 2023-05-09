import { sellOffer } from '../../../tests/unit/data/offerData'
import { defaultFundingStatus } from '../../utils/offer/constants'
import Summary from './Summary'
import { createRenderer } from 'react-test-renderer/shallow'

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
  const offerDraft: SellOfferDraft = {
    creationDate: new Date(),
    type: 'ask',
    amount: 1000000,
    premium: 1.5,
    returnAddress,
    paymentData: sellOffer.paymentData,
    funding: defaultFundingStatus,
    meansOfPayment: sellOffer.meansOfPayment,
    originalPaymentData: sellOffer.originalPaymentData,
  }
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
