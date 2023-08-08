import { toMatchDiffSnapshot } from 'snapshot-diff'
import { TotalBalance } from './TotalBalance'
import { render, fireEvent } from '@testing-library/react-native'
expect.extend({ toMatchDiffSnapshot })

jest.mock('../../../../components/bitcoin', () => ({
  BTCAmount: 'BTCAmount',
}))

describe('TotalBalance', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<TotalBalance amount={100000} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('hide balance when the eye icon is pressed', () => {
    const { getByAccessibilityHint, toJSON } = render(<TotalBalance amount={100000} />)
    const eyeIcon = getByAccessibilityHint('hide wallet balance')
    fireEvent.press(eyeIcon)

    const hiddenBalance = toJSON()
    const eyeOffIcon = getByAccessibilityHint('show wallet balance')
    fireEvent.press(eyeOffIcon)

    const shownBalance = toJSON()
    expect(hiddenBalance).toMatchDiffSnapshot(shownBalance)
  })
})
