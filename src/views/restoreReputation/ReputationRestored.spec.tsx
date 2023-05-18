import { createRenderer } from 'react-test-renderer/shallow'
import { ReputationRestored } from './ReputationRestored'

describe('ReputationRestored', () => {
  const shallowRenderer = createRenderer()

  it('should render correctly', () => {
    shallowRenderer.render(<ReputationRestored />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
