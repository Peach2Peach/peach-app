import ShallowRenderer from 'react-test-renderer/shallow'
import { IncorrectFunding } from './IncorrectFunding'

describe('IncorrectFunding', () => {
  const renderer = ShallowRenderer.createRenderer()
  const utxos = 3
  it('renders correctly', () => {
    renderer.render(<IncorrectFunding {...{ utxos }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
