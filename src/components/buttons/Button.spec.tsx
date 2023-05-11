import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../styles/tailwind'
import { Button } from './Button'

describe('Button', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<Button textColor={tw`text-primary-main`}>Text</Button>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium viewports', () => {
    tw.setWindowDimensions({
      width: 400,
      height: 700,
    })
    shallowRenderer.render(<Button textColor={tw`text-primary-main`}>Text</Button>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
