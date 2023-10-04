import { fireEvent, render } from '@testing-library/react-native'
import { getBuyOfferDraft } from '../../../tests/unit/data/offerDraftData'

import { toMatchDiffSnapshot } from 'snapshot-diff'
import { NavigationWrapper, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { BuySummary } from './BuySummary'
expect.extend({ toMatchDiffSnapshot })

const publishOffer = jest.fn()

const goToMessageSigning = jest.fn()

const defaultBuySummary = {
  offerDraft: getBuyOfferDraft(),
  canPublish: true,
  publishOffer,
  isPublishing: false,
  goToMessageSigning,
}
const useBuySummarySetupMock = jest.fn().mockReturnValue(defaultBuySummary)
jest.mock('./hooks/useBuySummarySetup', () => ({
  useBuySummarySetup: (...args: unknown[]) => useBuySummarySetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

const wrapper = NavigationWrapper

describe('BuySummary', () => {
  it('should render the BuySummary view', () => {
    const { toJSON } = render(<BuySummary />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly while peach wallet is still signing message', () => {
    const defaultView = render(<BuySummary />, { wrapper }).toJSON()
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: true,
      canPublish: false,
    })
    const { toJSON } = render(<BuySummary />, { wrapper })

    expect(defaultView).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly with custom payout wallet and signature is still missing', () => {
    const defaultView = render(<BuySummary />, { wrapper }).toJSON()
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    const { toJSON } = render(<BuySummary />, { wrapper })

    expect(defaultView).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when publishing', () => {
    const defaultView = render(<BuySummary />, { wrapper }).toJSON()
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      isPublishing: true,
    })
    const { toJSON } = render(<BuySummary />, { wrapper })

    expect(defaultView).toMatchDiffSnapshot(toJSON())
  })
  it('clicking on "publish" publishes offer', () => {
    useBuySummarySetupMock.mockReturnValue({
      ...defaultBuySummary,
      offerDraft: getBuyOfferDraft(),
    })
    const { getByText } = render(<BuySummary />, {
      wrapper,
    })
    fireEvent(getByText('publish'), 'onPress')
    expect(publishOffer).toHaveBeenCalled()
  })
  it('clicking on "next" navigates to message signing', () => {
    useBuySummarySetupMock.mockReturnValue({
      ...defaultBuySummary,
      offerDraft: getBuyOfferDraft(),
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    const { getByText } = render(<BuySummary />, { wrapper })
    fireEvent(getByText('next'), 'onPress')
    expect(goToMessageSigning).toHaveBeenCalled()
  })
  it('should navigate to the network fees screen when clicking on the bitcoin icon', () => {
    const { getByAccessibilityHint } = render(<BuySummary />, { wrapper })
    fireEvent.press(getByAccessibilityHint('go to network fees'))

    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
})
