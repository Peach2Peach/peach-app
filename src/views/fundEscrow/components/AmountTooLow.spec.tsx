import { createRenderer } from 'react-test-renderer/shallow'
import { AmountTooLow } from './AmountTooLow'

describe('AmountTooLow', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<AmountTooLow available={123456} needed={1234560} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
