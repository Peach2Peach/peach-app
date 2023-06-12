import { MatchOfferButton } from './MatchOfferButton'
import { render, act, fireEvent } from '@testing-library/react-native'
import i18n from '../../../utils/i18n'
import { options } from './options'
import { useMatchStore } from '../store'

describe('MatchOfferButton', () => {
  const matchOffer = jest.fn()
  const defaultProps = {
    matchId: 'matchId',
    matchOffer,
    optionName: 'matchOffer' as const,
  }
  beforeEach(() => {
    useMatchStore.setState((state) => ({
      ...state,
      matchSelectors: {
        [defaultProps.matchId]: {
          showPaymentMethodPulse: false,
        },
      },
    }))
  })
  it('renders correctly', () => {
    const { toJSON } = render(<MatchOfferButton {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call matchOffer when matchOffer is pressed', () => {
    const { getByText } = render(<MatchOfferButton {...defaultProps} />)
    act(() => {
      fireEvent.press(getByText(i18n(options[defaultProps.optionName].text)))
    })
    expect(matchOffer).toHaveBeenCalled()
  })
  it('should show the paymentmethod pulse when there is a missing selection', () => {
    const { getByText } = render(<MatchOfferButton {...{ ...defaultProps, optionName: 'missingSelection' }} />)
    act(() => {
      fireEvent.press(getByText(i18n(options.missingSelection.text)))
    })

    expect(matchOffer).not.toHaveBeenCalled()
    expect(useMatchStore.getState().matchSelectors[defaultProps.matchId].showPaymentMethodPulse).toBe(true)
  })
})
