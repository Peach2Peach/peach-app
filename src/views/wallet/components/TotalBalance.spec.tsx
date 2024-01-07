import { toMatchDiffSnapshot } from 'snapshot-diff'
import { fireEvent, render } from 'test-utils'
import { TotalBalance } from './TotalBalance'
expect.extend({ toMatchDiffSnapshot })

jest.mock('../../../components/bitcoin/BTCAmount', () => ({
  BTCAmount: 'BTCAmount',
}))

describe('TotalBalance', () => {
  const defaultComponent = <TotalBalance amount={100000} />
  it('renders correctly', () => {
    const { toJSON } = render(defaultComponent)
    expect(toJSON()).toMatchSnapshot()
  })
  it('hide balance when the eye icon is pressed', () => {
    const { getByAccessibilityHint, toJSON } = render(defaultComponent)
    const eyeIcon = getByAccessibilityHint('hide wallet balance')
    fireEvent.press(eyeIcon)

    const hiddenBalance = toJSON()
    const eyeOffIcon = getByAccessibilityHint('show wallet balance')
    fireEvent.press(eyeOffIcon)

    const shownBalance = toJSON()
    expect(hiddenBalance).toMatchDiffSnapshot(shownBalance)
  })
  it('renders correctly when isRefreshing is true', () => {
    const base = render(defaultComponent).toJSON()
    const { toJSON } = render(<TotalBalance amount={100000} isRefreshing />)
    expect(base).toMatchDiffSnapshot(toJSON())
  })
})
