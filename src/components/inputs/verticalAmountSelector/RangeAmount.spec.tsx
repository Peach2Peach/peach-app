import { createRenderer } from 'react-test-renderer/shallow'
import { RangeAmount } from './RangeAmount'

describe('RangeAmount', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<RangeAmount min={50000} max={5000000} value={[60000, 600000]} onChange={jest.fn()} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
