import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import { Button } from './Button'
expect.extend({ toMatchDiffSnapshot })

const useIsMediumScreenMock = jest.fn(() => false)
jest.mock('../../hooks/useIsMediumScreen', () => ({
  useIsMediumScreen: () => useIsMediumScreenMock(),
}))

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
