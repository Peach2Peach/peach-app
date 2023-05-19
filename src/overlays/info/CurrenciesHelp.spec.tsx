import ShallowRenderer from 'react-test-renderer/shallow'
import { CurrenciesHelp } from './CurrenciesHelp'

describe('CurrenciesHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<CurrenciesHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
