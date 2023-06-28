import ShallowRenderer from 'react-test-renderer/shallow'
import { contract } from '../../../../../tests/unit/data/contractData'
import { AccountInfo } from './AccountInfo'

describe('AccountInfo', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('should render correctly', () => {
    renderer.render(<AccountInfo user={contract.buyer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
