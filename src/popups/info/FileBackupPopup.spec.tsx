import ShallowRenderer from 'react-test-renderer/shallow'
import { FileBackupPopup } from './FileBackupPopup'

describe('FileBackupPopup', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<FileBackupPopup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
