import { createRenderer } from 'react-test-renderer/shallow'
import { SelectAmount } from './SelectAmount'
import { Text } from '../../text'

describe('SelectAmount', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<SelectAmount min={50000} max={5000000} value={60000} onChange={jest.fn()} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render children correctly', () => {
    shallowRenderer.render(
      <SelectAmount min={50000} max={5000000} value={60000} onChange={jest.fn()}>
        <Text>I'm a child</Text>
      </SelectAmount>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
