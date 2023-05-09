import ShallowRenderer from 'react-test-renderer/shallow'
import { ReferralsHelp } from './ReferralsHelp'

describe('ReferralsHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<ReferralsHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
