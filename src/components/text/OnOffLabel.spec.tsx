import ShallowRenderer from 'react-test-renderer/shallow'
import { OnOffLabel } from './OnOffLabel'

describe('OnOffLabel', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly when active', () => {
    renderer.render(
      <OnOffLabel active={true} onPress={jest.fn()}>
        Test
      </OnOffLabel>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when inactive', () => {
    renderer.render(
      <OnOffLabel active={false} onPress={jest.fn()}>
        Test
      </OnOffLabel>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
