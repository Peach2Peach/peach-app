import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'

import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { BuySummary } from './BuySummary'

const publishOffer = jest.fn()

const message = 'message'
const messageSignature = 'messageSignature'
const goToMessageSigning = jest.fn()

const defaultBuySummary = {
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

describe('BuySummary', () => {
  const renderer = createRenderer()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the BuySummary view', () => {
    renderer.render(<BuySummary />, { wrapper: NavigationWrapper })
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
    renderer.render(<BuySummary />, { wrapper: NavigationWrapper })
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
    renderer.render(<BuySummary />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly when publishing', () => {
    useBuySummarySetupMock.mockReturnValueOnce({
      ...defaultBuySummary,
      isPublishing: true,
    })
    renderer.render(<BuySummary />, { wrapper: NavigationWrapper })
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('clicking on "publish" publishes offer', () => {
    useBuySummarySetupMock.mockReturnValue({
      ...defaultBuySummary,
      offerDraft: { meansOfPayment: { EUR: ['sepa'] }, amount: [50000, 100000] },
    })
    const { getByText } = render(<BuySummary />, {
      wrapper: NavigationWrapper,
    })
    fireEvent(getByText('publish'), 'onPress')
    expect(publishOffer).toHaveBeenCalled()
  })
  it('clicking on "next" navigates to message signing', () => {
    useBuySummarySetupMock.mockReturnValue({
      ...defaultBuySummary,
      offerDraft: { meansOfPayment: { EUR: ['sepa'] }, amount: [50000, 100000] },
      messageSignature: undefined,
      peachWalletActive: false,
      canPublish: false,
    })
    const { getByText } = render(<BuySummary />, { wrapper: NavigationWrapper })
    fireEvent(getByText('next'), 'onPress')
    expect(goToMessageSigning).toHaveBeenCalled()
  })
})
