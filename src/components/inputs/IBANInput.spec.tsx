import { createRenderer } from 'react-test-renderer/shallow'
import { IBANInput } from './IBANInput'

describe('IBANInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<IBANInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
