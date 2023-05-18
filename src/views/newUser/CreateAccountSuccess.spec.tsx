import { createRenderer } from 'react-test-renderer/shallow'
import { CreateAccountSuccess } from './CreateAccountSuccess'

describe('CreateAccountSuccess', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<CreateAccountSuccess />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
