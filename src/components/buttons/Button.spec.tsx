import { createRenderer } from 'react-test-renderer/shallow'
import { Button } from './Button'
import tw from '../../styles/tailwind'

type Dimension = {
  width: number
  height: number
}

const mockDimensions = ({ width, height }: Dimension) => {
  jest.resetModules()
  jest.doMock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({ width, height }),
  }))
}

describe('Button', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<Button textColor={tw`text-primary-main`}>Text</Button>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium viewports', () => {
    mockDimensions({
      width: 400,
      height: 700,
    })
    shallowRenderer.render(<Button textColor={tw`text-primary-main`}>Text</Button>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
