import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../styles/tailwind'
import { Bubble } from './Bubble'

describe('Bubble', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<Bubble textColor={tw`text-primary-main`}>Text</Bubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    shallowRenderer.render(
      <Bubble textColor={tw`text-primary-main`} iconId="chevronsUp">
        Text
      </Bubble>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with no background', () => {
    shallowRenderer.render(
      <Bubble textColor={tw`text-primary-main`} noBackground>
        Text
      </Bubble>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
