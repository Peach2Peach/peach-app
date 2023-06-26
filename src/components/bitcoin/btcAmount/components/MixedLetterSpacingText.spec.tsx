import { MixedLetterSpacingText } from './MixedLetterSpacingText'
import { createRenderer } from 'react-test-renderer/shallow'

describe('MixedLetterSpacingText', () => {
  const value = 1280000
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<MixedLetterSpacingText value={value} style={[]} isError={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with error', () => {
    renderer.render(<MixedLetterSpacingText value={value} style={[]} isError={true} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly if the value is 0', () => {
    renderer.render(<MixedLetterSpacingText value={0} style={[]} isError={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
