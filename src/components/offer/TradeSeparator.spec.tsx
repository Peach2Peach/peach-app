import { TradeSeparator } from './TradeSeparator'
import { createRenderer } from 'react-test-renderer/shallow'

describe('TradeSeparator', () => {
  const renderer = createRenderer()
  const defaultProps = {
    disputeActive: false,
    iconId: undefined,
    iconColor: undefined,
    text: 'text',
  }
  it('renders correctly', () => {
    renderer.render(<TradeSeparator {...defaultProps} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with iconId', () => {
    renderer.render(<TradeSeparator {...defaultProps} iconId="xCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with iconColor', () => {
    renderer.render(<TradeSeparator {...defaultProps} iconId="xCircle" iconColor="iconColor" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with disputeActive', () => {
    renderer.render(<TradeSeparator {...defaultProps} disputeActive />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with iconId, iconColor and disputeActive', () => {
    renderer.render(<TradeSeparator {...defaultProps} iconId="xCircle" iconColor="iconColor" disputeActive />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
