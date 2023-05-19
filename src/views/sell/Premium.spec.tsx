import { createRenderer } from 'react-test-renderer/shallow'
import { getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import Premium from './Premium'

const premium = 1.5
const updatePremium = jest.fn()
const currentPrice = 150
const displayCurrency = 'EUR'
const usePremiumSetupMock = jest.fn().mockReturnValue({
  premium,
  updatePremium,
  currentPrice,
  displayCurrency,
  stepValid: true,
})
jest.mock('./hooks/usePremiumSetup', () => ({
  usePremiumSetup: (...args: any[]) => usePremiumSetupMock(...args),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('Premium', () => {
  const offerDraft = getSellOfferDraft()
  const setOfferDraft = jest.fn()
  const next = jest.fn()
  const renderer = createRenderer()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the Premium view', () => {
    renderer.render(<Premium {...{ offerDraft, setOfferDraft, next }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
