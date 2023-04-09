import { BankNumberInput } from './BankNumberInput'
import { createRenderer } from 'react-test-renderer/shallow'

describe('BankNumberInput', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BankNumberInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
