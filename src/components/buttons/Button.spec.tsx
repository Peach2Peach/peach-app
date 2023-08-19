import { render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import tw from '../../styles/tailwind'
import { Button, NewButton } from './Button'
expect.extend({ toMatchDiffSnapshot })

const useIsMediumScreenMock = jest.fn(() => false)
jest.mock('../../hooks/useIsMediumScreen', () => ({
  useIsMediumScreen: () => useIsMediumScreenMock(),
}))

describe('Button', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<Button textColor={tw`text-primary-main`}>Text</Button>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium viewports', () => {
    useIsMediumScreenMock.mockReturnValueOnce(true)
    shallowRenderer.render(<Button textColor={tw`text-primary-main`}>Text</Button>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly while loading', () => {
    shallowRenderer.render(
      <Button textColor={tw`text-primary-main`} loading>
        Text
      </Button>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    shallowRenderer.render(
      <Button textColor={tw`text-primary-main`} iconId="alertCircle">
        Text
      </Button>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})

describe('NewButton', () => {
  const defaultButton = render(<NewButton>Text</NewButton>).toJSON()
  it('should render correctly', () => {
    expect(defaultButton).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    const { toJSON } = render(<NewButton iconId="alertCircle">Text</NewButton>)
    expect(defaultButton).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when disabled', () => {
    const { toJSON } = render(<NewButton disabled>Text</NewButton>)
    expect(defaultButton).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when ghost is true', () => {
    const { toJSON } = render(<NewButton ghost>Text</NewButton>)
    expect(defaultButton).toMatchDiffSnapshot(toJSON())
  })
})
