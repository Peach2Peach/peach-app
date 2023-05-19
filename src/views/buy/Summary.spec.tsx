import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { getBuyOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import Summary from './Summary'

const releaseAddress = 'releaseAddress'
const walletLabel = 'walletLabel'
const publishOffer = jest.fn()

const message = 'message'
const messageSignature = 'messageSignature'
const goToMessageSigning = jest.fn()

const defaultBuySummary = {
  releaseAddress,
  walletLabel,
  message,
  messageSignature,
  goToMessageSigning,
  canPublish: true,
  publishOffer,
  isPublishing: false,
}
const useBuySummarySetupMock = jest.fn().mockReturnValue(defaultBuySummary)
jest.mock('./hooks/useBuySummarySetup', () => ({
  useBuySummarySetup: (...args: any[]) => useBuySummarySetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('Summary', () => {
  const renderer = createRenderer()
  const offerDraft = getBuyOfferDraft()
  const setOfferDraft = jest.fn()
  const next = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the Summary view', () => {
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly while peach wallet is still signing message', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: true,
      canPublish: false,
    })
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly with custom payout wallet and signature is still missing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly when publishing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      isPublishing: true,
    })
    renderer.render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('clicking on "publish" publishes offer', () => {
    const { getByText } = render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    fireEvent(getByText('publish'), 'onPress')
    expect(publishOffer).toHaveBeenCalled()
  })
  it('clicking on "next" navigates to message signing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    const { getByText } = render(<Summary {...{ offerDraft, setOfferDraft, next }} />, { wrapper: NavigationWrapper })
    fireEvent(getByText('next'), 'onPress')
    expect(goToMessageSigning).toHaveBeenCalled()
  })
})
