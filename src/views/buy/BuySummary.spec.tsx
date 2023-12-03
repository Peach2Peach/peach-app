import { fireEvent, render } from 'test-utils'

import { toMatchDiffSnapshot } from 'snapshot-diff'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { defaultSettings, useSettingsStore } from '../../store/settingsStore'
import { BuySummary } from './BuySummary'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('BuySummary', () => {
  beforeEach(() => {
    useSettingsStore.setState(defaultSettings)
  })
  it('should render the BuySummary view', () => {
    const { toJSON } = render(<BuySummary />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when publishing', () => {
    const defaultView = render(<BuySummary />).toJSON()
    const { toJSON, getByText } = render(<BuySummary />)
    fireEvent(getByText('publish'), 'onPress')

    expect(defaultView).toMatchDiffSnapshot(toJSON())
  })
  it('clicking on "next" navigates to message signing', () => {
    useSettingsStore.setState({
      peachWalletActive: false,
      payoutAddressLabel: 'payoutAddressLabel',
      payoutAddress: 'payoutAddress',
    })
    const { getByText } = render(<BuySummary />)
    fireEvent(getByText('next'), 'onPress')
    expect(navigateMock).toHaveBeenCalledWith('signMessage')
  })
  it('should navigate to the network fees screen when clicking on the bitcoin icon', () => {
    const { getByAccessibilityHint } = render(<BuySummary />)
    fireEvent.press(getByAccessibilityHint('go to network fees'))

    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
})
