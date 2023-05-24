import ShallowRenderer from 'react-test-renderer/shallow'
import { WrongFundingAmount } from './WrongFundingAmount'

describe('WrongFundingAmount', () => {
  const renderer = ShallowRenderer.createRenderer()
  const amount = 42060
  const actualAmount = 69420
  const maxAmount = 61500
  it('renders correctly', () => {
    renderer.render(<WrongFundingAmount {...{ amount, actualAmount, maxAmount }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
