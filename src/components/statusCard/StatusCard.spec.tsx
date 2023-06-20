import { createRenderer } from 'react-test-renderer/shallow'
import { StatusCard } from './StatusCard'

const mockProps = {
  title: 'title',
  subtext: 'subtext',
  onPress: jest.fn(),
  color: 'orange',
} as const

describe('StatusCard', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<StatusCard {...mockProps} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
