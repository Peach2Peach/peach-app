import { act, fireEvent, render } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { getStateMock, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { NextButton } from './NextButton'

const wrapper = NavigationAndQueryClientWrapper

describe('NextButton', () => {
  afterEach(() => {
    act(() => {
      useOfferPreferences.setState((prev) => ({ canContinue: { ...prev.canContinue, paymentMethods: true } }))
    })
  })
  it('renders correctly', () => {
    const { toJSON } = render(<NextButton />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    useOfferPreferences.setState((prev) => ({ canContinue: { ...prev.canContinue, paymentMethods: false } }))
    const { toJSON } = render(<NextButton />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should go to the sell summary when coming from the premium screen', () => {
    getStateMock.mockReturnValue({
      routes: [{ name: 'premium' }, { name: 'paymentMethods' }],
    })
    const { getByText } = render(<NextButton />, { wrapper })
    fireEvent.press(getByText('next'))
    expect(navigateMock).toHaveBeenCalledWith('sellSummary')
  })
  it('should go to the buy summary when not coming from the premium screen', () => {
    getStateMock.mockReturnValue({
      routes: [{ name: 'buy' }, { name: 'paymentMethods' }],
    })
    const { getByText } = render(<NextButton />, { wrapper })
    fireEvent.press(getByText('next'))
    expect(navigateMock).toHaveBeenCalledWith('buySummary')
  })
})
