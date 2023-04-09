import { createRenderer } from 'react-test-renderer/shallow'
import { WalletInput } from './WalletInput'

describe('WalletInput', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<WalletInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
