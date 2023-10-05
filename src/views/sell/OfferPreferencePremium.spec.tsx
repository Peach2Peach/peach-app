import { createRenderer } from 'react-test-renderer/shallow'
import { OfferPreferencePremium } from './OfferPreferencePremium'

jest.mock('./hooks/usePremiumSetup', () => ({
  usePremiumStepValidation: jest.fn(),
}))
jest.mock('../../hooks', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('OfferPreferencePremium', () => {
  const renderer = createRenderer()

  it('should render the OfferPreferencePremium view', () => {
    renderer.render(<OfferPreferencePremium />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
