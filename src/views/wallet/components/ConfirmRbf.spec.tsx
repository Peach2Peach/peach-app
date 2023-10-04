import ShallowRenderer from 'react-test-renderer/shallow'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { ConfirmRbf } from './ConfirmRbf'
expect.extend({ toMatchDiffSnapshot })

describe('ConfirmRbf', () => {
  const BaseComponent = <ConfirmRbf oldFeeRate={1} newFeeRate={3} bytes={110} sendingAmount={4000} />
  const renderer = ShallowRenderer.createRenderer()

  it('renders correctly', () => {
    renderer.render(BaseComponent)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with no change warning', () => {
    renderer.render(BaseComponent)
    const base = renderer.getRenderOutput()
    renderer.render(<ConfirmRbf oldFeeRate={1} newFeeRate={3} bytes={110} sendingAmount={4000} hasNoChange />)
    expect(base).toMatchDiffSnapshot(renderer.getRenderOutput())
  })
})
