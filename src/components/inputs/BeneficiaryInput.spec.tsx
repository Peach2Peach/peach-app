import { createRenderer } from 'react-test-renderer/shallow'
import { BeneficiaryInput } from './BeneficiaryInput'

describe('BeneficiaryInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BeneficiaryInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
