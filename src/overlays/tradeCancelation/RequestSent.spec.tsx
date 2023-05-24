import { RequestSent } from './RequestSent'
import { createRenderer } from 'react-test-renderer/shallow'

describe('RequestSent', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<RequestSent />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
