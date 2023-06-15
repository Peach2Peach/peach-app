import { PremiumInput } from './PremiumInput'
import { createRenderer } from 'react-test-renderer/shallow'
import { useOfferPreferences } from '../../../store/offerPreferenes'

describe('PremiumInput', () => {
  const renderer = createRenderer()

  it('should render the PremiumInput view with premium', () => {
    useOfferPreferences.getState().setPremium(3.2)
    renderer.render(<PremiumInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with 0 premium', () => {
    useOfferPreferences.getState().setPremium(0)
    renderer.render(<PremiumInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with discount', () => {
    useOfferPreferences.getState().setPremium(-3.2)
    renderer.render(<PremiumInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
