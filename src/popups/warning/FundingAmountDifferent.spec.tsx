import ShallowRenderer from 'react-test-renderer/shallow'
import { FundingAmountDifferent } from './FundingAmountDifferent'

describe('FundingAmountDifferent', () => {
  const renderer = ShallowRenderer.createRenderer()
  const amount = 42060
  const actualAmount = 69420
  it('renders correctly', () => {
    renderer.render(<FundingAmountDifferent {...{ amount, actualAmount }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
