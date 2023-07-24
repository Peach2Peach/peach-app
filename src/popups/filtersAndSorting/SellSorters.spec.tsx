import { SellSorters } from './SellSorters'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePopupStore } from '../../store/usePopupStore'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'

jest.useFakeTimers()

const patchOfferMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../utils/peachAPI', () => ({
  patchOffer: (...args: unknown[]) => patchOfferMock(...args),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('SellSorters', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SellSorters />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('ApplySellSorterAction', () => {
  it('should apply the selected sorter', () => {
    const { getByText } = render(<SellSorters />, { wrapper })
    const applyButton = getByText('apply')
    const highestPriceButton = getByText('highest price first')

    fireEvent.press(highestPriceButton)
    fireEvent.press(applyButton)

    expect(useOfferPreferences.getState().sortBy.sellOffer).toEqual(['highestPrice'])
  })

  it('should invalidate all matches queries', async () => {
    queryClient.setQueryData(['matches'], { matches: [] })
    queryClient.setQueryData(['matches', sellOffer.id], { matches: [] })
    queryClient.setQueryData(['matches', sellOffer.id, 'bestReputation'], { matches: [] })

    const { getByText } = render(<SellSorters />, { wrapper })
    const applyButton = getByText('apply')

    fireEvent.press(applyButton)

    await waitFor(() => {
      expect(queryClient.getQueryState(['matches'])?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(['matches', sellOffer.id])?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(['matches', sellOffer.id, 'bestReputation'])?.isInvalidated).toBe(true)
    })
  })

  it('should close the popup', () => {
    const { getByText } = render(<SellSorters />, { wrapper })
    const applyButton = getByText('apply')

    fireEvent.press(applyButton)
    expect(usePopupStore.getState().visible).toBe(false)
  })
})
