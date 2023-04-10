import { createRenderer } from 'react-test-renderer/shallow'
import { BICInput } from './BICInput'

describe('BICInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<BICInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is optional when specified', () => {
    renderer.render(<BICInput required={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('is neither optional nor required when specified', () => {
    renderer.render(<BICInput required={undefined} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
