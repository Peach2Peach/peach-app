import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../styles/tailwind'
import { BubbleBase } from './BubbleBase'

describe('BubbleBase', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<BubbleBase textColor={tw`text-primary-main`}>Text</BubbleBase>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render background and border color', () => {
    shallowRenderer.render(
      <BubbleBase textColor={tw`text-primary-main`} color={tw`bg-transparent`} borderColor={tw`border-black-100`}>
        Text
      </BubbleBase>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    shallowRenderer.render(
      <BubbleBase textColor={tw`text-primary-main`} iconId="chevronsUp">
        Text
      </BubbleBase>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon and specific color', () => {
    shallowRenderer.render(
      <BubbleBase textColor={tw`text-primary-main`} iconColor={tw`text-black-100`} iconId="chevronsUp">
        Text
      </BubbleBase>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
