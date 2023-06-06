import { createRenderer } from 'react-test-renderer/shallow'
import { ReportSuccess } from './ReportSuccess'

describe('ReportSuccess', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<ReportSuccess />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
