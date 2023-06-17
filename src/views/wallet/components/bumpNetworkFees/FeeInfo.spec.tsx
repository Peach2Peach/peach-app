import ShallowRenderer from 'react-test-renderer/shallow'
import { FeeInfo } from './FeeInfo'

describe('FeeInfo', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<FeeInfo label="label" fee={1} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with error indication', () => {
    renderer.render(<FeeInfo label="label" fee={1} isError />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
