import { BuyFilterAndSort } from './BuyFilterAndSort'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePopupStore } from '../../store/usePopupStore'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { TextInput } from 'react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

const patchOfferMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../utils/peachAPI', () => ({
  patchOffer: (...args: unknown[]) => patchOfferMock(...args),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('BuyFilterAndSort', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should use the offer maxPremium as the default value for the maxPremium input', () => {
    const offerWithMaxPremium = { ...buyOffer, maxPremium: 0.5 }
    const { getByPlaceholderText, toJSON } = render(<BuyFilterAndSort offer={offerWithMaxPremium} />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    expect(maxPremiumInput.props.value).toBe('0.5')
    expect(render(<BuyFilterAndSort offer={buyOffer} />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should focus the maxPremium input when the maxPremium checkbox gets checked', () => {
    const focusSpy = jest.spyOn(TextInput.prototype, 'focus')
    const { getByText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const checkbox = getByText('max premium')

    fireEvent.press(checkbox)
    expect(focusSpy).toHaveBeenCalled()
  })
  it("shouldn't focus the input when the filter has changed from the global state", () => {
    const focusSpy = jest.spyOn(TextInput.prototype, 'focus')
    const { getByText, getByPlaceholderText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    const checkbox = getByText('max premium')

    fireEvent.changeText(maxPremiumInput, '0.5')
    fireEvent.press(checkbox)
    expect(focusSpy).not.toHaveBeenCalled()
  })
  it('should use the global preferences as defaults when the offer is undefined', () => {
    const { toJSON } = render(<BuyFilterAndSort />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('ApplyBuyFilterAction', () => {
  beforeEach(() => {
    useOfferPreferences.setState({ filter: { buyOffer: { maxPremium: null } } })
    usePopupStore.setState({ visible: true })
  })
  it('should patch the offer with the selected filter', async () => {
    const { getByText, getByPlaceholderText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    const applyButton = getByText('apply')
    const checkbox = getByText('max premium')

    fireEvent.changeText(maxPremiumInput, '0.5')
    fireEvent.press(checkbox)
    fireEvent.press(applyButton)
    await waitFor(() => expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: 0.5 }))
  })
  it('should set maxPremium to null when the checkbox is not checked', async () => {
    const { getByText, getByPlaceholderText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    const applyButton = getByText('apply')

    fireEvent.changeText(maxPremiumInput, '0.5')
    fireEvent.press(applyButton)
    await waitFor(() => expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: null }))
  })
  it('should set maxPremium to null when the checkbox is checked but the input is empty', async () => {
    const { getByText, getByPlaceholderText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    const applyButton = getByText('apply')
    const checkbox = getByText('max premium')

    fireEvent.changeText(maxPremiumInput, '')
    fireEvent.press(checkbox)
    fireEvent.press(applyButton)
    await waitFor(() => expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: null }))
  })

  it('should update the global state with the new filter', () => {
    const { getByText, getByPlaceholderText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    const applyButton = getByText('apply')
    const checkbox = getByText('max premium')

    fireEvent.changeText(maxPremiumInput, '0.5')
    fireEvent.press(checkbox)
    fireEvent.press(applyButton)
    expect(useOfferPreferences.getState().filter.buyOffer).toEqual({ maxPremium: 0.5 })

    fireEvent.changeText(maxPremiumInput, '')
    fireEvent.press(applyButton)
    expect(useOfferPreferences.getState().filter.buyOffer).toEqual({ maxPremium: null })

    fireEvent.press(checkbox)
    fireEvent.changeText(maxPremiumInput, '0.5')
    fireEvent.press(applyButton)
    expect(useOfferPreferences.getState().filter.buyOffer).toEqual({ maxPremium: null })
  })

  it('should apply the selected sorter', () => {
    const { getByText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const applyButton = getByText('apply')
    const highestAmountButton = getByText('highest amount first')

    fireEvent.press(highestAmountButton)
    fireEvent.press(applyButton)

    expect(useOfferPreferences.getState().sortBy.buyOffer).toEqual(['highestAmount'])
  })

  it('should invalidate all matches queries', async () => {
    queryClient.setQueryData(['matches'], { matches: [] })
    queryClient.setQueryData(['matches', buyOffer.id], { matches: [] })
    queryClient.setQueryData(['matches', buyOffer.id, 'bestReputation'], { matches: [] })

    const { getByText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const applyButton = getByText('apply')

    fireEvent.press(applyButton)

    await waitFor(() => {
      expect(queryClient.getQueryState(['matches'])?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(['matches', buyOffer.id])?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(['matches', buyOffer.id, 'bestReputation'])?.isInvalidated).toBe(true)
    })
  })

  it('should close the popup', () => {
    const { getByText } = render(<BuyFilterAndSort offer={buyOffer} />, { wrapper })
    const applyButton = getByText('apply')

    fireEvent.press(applyButton)
    expect(usePopupStore.getState().visible).toBe(false)
  })

  it('should not patch the offer when the offer is undefined', async () => {
    const { getByText, getByPlaceholderText } = render(<BuyFilterAndSort />, { wrapper })
    const maxPremiumInput = getByPlaceholderText('20.00')
    const applyButton = getByText('apply')
    const checkbox = getByText('max premium')
    const highestAmountButton = getByText('highest amount first')

    fireEvent.changeText(maxPremiumInput, '0.5')
    fireEvent.press(checkbox)
    fireEvent.press(highestAmountButton)

    fireEvent.press(applyButton)

    await waitFor(() => expect(patchOfferMock).not.toHaveBeenCalled())

    expect(useOfferPreferences.getState().filter.buyOffer).toEqual({ maxPremium: 0.5 })
    expect(useOfferPreferences.getState().sortBy.buyOffer).toEqual(['highestAmount'])
    expect(usePopupStore.getState().visible).toBe(false)
  })
})
