import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { PremiumInput } from './PremiumInput'

describe('PremiumInput', () => {
  const renderer = createRenderer()
  const onChange = jest.fn()
  it('should render the PremiumInput view with premium', () => {
    renderer.render(<PremiumInput premium={3.2} setPremium={onChange} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with 0 premium', () => {
    renderer.render(<PremiumInput premium={0} setPremium={onChange} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with discount', () => {
    renderer.render(<PremiumInput premium={-3.2} setPremium={onChange} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('allows increasing and decreasing premium by 0.1', () => {
    const { getByAccessibilityHint } = render(<PremiumInput premium={-3.2} setPremium={onChange} />)
    fireEvent.press(getByAccessibilityHint('decrease number'))
    expect(onChange).toHaveBeenCalledWith(-3.3)
    fireEvent.press(getByAccessibilityHint('increase number'))
    expect(onChange).toHaveBeenCalledWith(-3.1)
  })
})
