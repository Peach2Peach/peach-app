import { createRenderer } from 'react-test-renderer/shallow'
import { SelectAmount } from './SelectAmount'

describe('SelectAmount', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<SelectAmount min={50000} max={5000000} value={60000} onChange={jest.fn()} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
