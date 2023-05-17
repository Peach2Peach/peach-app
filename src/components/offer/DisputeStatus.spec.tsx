import { DisputeStatus } from './DisputeStatus'
import { createRenderer } from 'react-test-renderer/shallow'

describe('DisputeStatus', () => {
  const renderer = createRenderer()
  const defaultProps = {
    winner: 'buyer',
    view: 'buyer',
  } as const
  it('renders correctly', () => {
    renderer.render(<DisputeStatus {...defaultProps} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with seller view', () => {
    renderer.render(<DisputeStatus {...defaultProps} view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with seller winner', () => {
    renderer.render(<DisputeStatus {...defaultProps} winner="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with seller winner and seller view', () => {
    renderer.render(<DisputeStatus {...defaultProps} winner="seller" view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
