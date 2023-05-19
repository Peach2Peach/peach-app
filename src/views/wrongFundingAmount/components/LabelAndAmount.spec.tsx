import { createRenderer } from 'react-test-renderer/shallow'
import { LabelAndAmount } from './LabelAndAmount'

describe('LabelAndAmount', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<LabelAndAmount label="label" amount={123456} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
