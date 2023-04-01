import { DeleteAccountPopup } from './DeleteAccountPopup'
import { createRenderer } from 'react-test-renderer/shallow'

describe('DeleteAccountPopup', () => {
  const renderer = createRenderer()
  it('renders popup correctly', () => {
    renderer.render(<DeleteAccountPopup title="popup" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders forRealsies correctly', () => {
    renderer.render(<DeleteAccountPopup title="forRealsies" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders success correctly', () => {
    renderer.render(<DeleteAccountPopup title="success" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
