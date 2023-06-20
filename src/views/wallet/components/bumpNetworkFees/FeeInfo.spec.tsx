import ShallowRenderer from 'react-test-renderer/shallow'
import { FeeInfo } from './FeeInfo'
import { render } from '@testing-library/react-native'

describe('FeeInfo', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<FeeInfo label="label" fee={1} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('rounds fees', () => {
    const { getByText } = render(<FeeInfo label="label" fee={2.1222} />)
    expect(getByText('2 sat/vB')).toBeDefined()
  })
  it('renders correctly with error indication', () => {
    renderer.render(<FeeInfo label="label" fee={1} isError />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})