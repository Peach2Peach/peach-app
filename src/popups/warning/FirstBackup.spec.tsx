import ShallowRenderer from 'react-test-renderer/shallow'
import { FirstBackup } from './FirstBackup'

describe('FirstBackup', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<FirstBackup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
