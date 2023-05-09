import ShallowRenderer from 'react-test-renderer/shallow'
import { SeedPhrasePopup } from './SeedPhrasePopup'

describe('SeedPhrasePopup', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<SeedPhrasePopup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
