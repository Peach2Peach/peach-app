import { render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import tw from '../../styles/tailwind'
import { Button, OldButton } from './Button'
expect.extend({ toMatchDiffSnapshot })

const useIsMediumScreenMock = jest.fn(() => false)
jest.mock('../../hooks/useIsMediumScreen', () => ({
  useIsMediumScreen: () => useIsMediumScreenMock(),
}))

describe('Button', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<OldButton textColor={tw`text-primary-main`}>Text</OldButton>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium viewports', () => {
    useIsMediumScreenMock.mockReturnValueOnce(true)
    shallowRenderer.render(<OldButton textColor={tw`text-primary-main`}>Text</OldButton>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly while loading', () => {
    shallowRenderer.render(
      <OldButton textColor={tw`text-primary-main`} loading>
        Text
      </OldButton>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    shallowRenderer.render(
      <OldButton textColor={tw`text-primary-main`} iconId="alertCircle">
        Text
      </OldButton>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})

describe('NewButton', () => {
  const defaultButton = render(<Button>Text</Button>).toJSON()
  it('should render correctly', () => {
    expect(defaultButton).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    const { toJSON } = render(<Button iconId="alertCircle">Text</Button>)
    expect(defaultButton).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when disabled', () => {
    const { toJSON } = render(<Button disabled>Text</Button>)
    expect(defaultButton).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when ghost is true', () => {
    const { toJSON } = render(<Button ghost>Text</Button>)
    expect(defaultButton).toMatchDiffSnapshot(toJSON())
  })
})
