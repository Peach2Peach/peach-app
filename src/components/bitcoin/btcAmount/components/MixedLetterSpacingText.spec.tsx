import { createRenderer } from 'react-test-renderer/shallow'
import { MixedLetterSpacingText } from './MixedLetterSpacingText'

describe('MixedLetterSpacingText', () => {
  const value = 1280000
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<MixedLetterSpacingText value={value} style={[]} white={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with white', () => {
    renderer.render(<MixedLetterSpacingText value={value} style={[]} white />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly if the value is 0', () => {
    renderer.render(<MixedLetterSpacingText value={0} style={[]} white={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
