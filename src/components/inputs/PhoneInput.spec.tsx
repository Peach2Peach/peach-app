import { PhoneInput } from './PhoneInput'
import { createRenderer } from 'react-test-renderer/shallow'

describe('PhoneInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<PhoneInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
