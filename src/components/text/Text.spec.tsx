import { createRenderer } from 'react-test-renderer/shallow'
import { PeachText } from './Text'

describe('PeachText', () => {
  const renderer = createRenderer()

  it('should render correctly', () => {
    renderer.render(<PeachText>Text</PeachText>)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
