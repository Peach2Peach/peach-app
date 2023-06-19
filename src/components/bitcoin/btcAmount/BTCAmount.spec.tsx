import { BTCAmount } from './BTCAmount'
import { MixedLetterSpacingText } from './components/MixedLetterSpacingText'
import { createRenderer } from 'react-test-renderer/shallow'

describe('MixedLetterSpacingText', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<MixedLetterSpacingText value={21000} style={[{ fontSize: 16 }]} isError={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with isError', () => {
    renderer.render(<MixedLetterSpacingText value={21000} style={[{ fontSize: 16 }]} isError />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})

describe('BTCAmount', () => {
  const renderer = createRenderer()
  const amount = 21000
  it('should render correctly for extra small size', () => {
    renderer.render(<BTCAmount amount={amount} size="x small" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for small size', () => {
    renderer.render(<BTCAmount amount={amount} size="small" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium size', () => {
    renderer.render(<BTCAmount amount={amount} size="medium" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for large size', () => {
    renderer.render(<BTCAmount amount={amount} size="large" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for extra large size', () => {
    renderer.render(<BTCAmount amount={amount} size="extra large" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with isError', () => {
    renderer.render(<BTCAmount amount={amount} size="extra large" isError />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when the value is 0', () => {
    renderer.render(<BTCAmount amount={0} size="extra large" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
