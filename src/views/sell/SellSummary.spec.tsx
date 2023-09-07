import { createRenderer } from 'react-test-renderer/shallow'
import { SellSummary } from './SellSummary'

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
  useSellSummarySetup: (...args: unknown[]) => useSellSummarySetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('SellSummary', () => {
  const renderer = createRenderer()

  it('should render the SellSummary view', () => {
    renderer.render(<SellSummary />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the SellSummary view with the publish button disabled', () => {
    useSellSummarySetupMock.mockReturnValueOnce({
      returnAddress,
      walletLabel,
      goToSetupRefundWallet,
      canPublish: false,
      publishOffer,
      isPublishing: false,
    })
    renderer.render(<SellSummary />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
