import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import { canGoBackMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { Header, HeaderConfig, OldHeader } from './Header'
expect.extend({ toMatchDiffSnapshot })

describe('Header', () => {
  const title = 'title'
  const icons: HeaderConfig['icons'] = [
    { id: 'mail', accessibilityHint: 'a mail icon', onPress: jest.fn() },
    { id: 'globe', accessibilityHint: 'a globe icon', onPress: jest.fn() },
  ]
  it('should render correctly for default state', () => {
    const { toJSON } = render(<OldHeader />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title and icons', () => {
    canGoBackMock.mockReturnValueOnce(true)
    const { toJSON } = render(<OldHeader {...{ title, icons }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with PriceStats', () => {
    const { toJSON } = render(<OldHeader {...{ title, icons, showPriceStats: true }} />)
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('NewHeader', () => {
  const title = 'title'
  const icons: HeaderConfig['icons'] = [
    { id: 'mail', accessibilityHint: 'a mail icon', onPress: jest.fn() },
    { id: 'globe', accessibilityHint: 'a globe icon', onPress: jest.fn() },
  ]
  it('should render correctly for default state', () => {
    const { toJSON } = render(<Header />)
    expect(render(<OldHeader />).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly with title and icons', () => {
    canGoBackMock.mockReturnValueOnce(true)
    const props = { title, icons }
    const { toJSON } = render(<Header {...props} />)
    expect(render(<OldHeader {...props} />).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly with PriceStats', () => {
    const props = { title, icons, showPriceStats: true }
    const { toJSON } = render(<Header {...props} />)
    expect(render(<OldHeader {...props} />).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
