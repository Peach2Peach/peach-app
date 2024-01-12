import { fireEvent, render, waitFor } from 'test-utils'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { SellSorters } from './SellSorters'

jest.useFakeTimers()

const closePopup = jest.fn()
jest.mock('../../components/popup/Popup', () => ({
  useClosePopup: () => closePopup,
}))

describe('SellSorters', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SellSorters />)
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('ApplySellSorterAction', () => {
  it('should apply the selected sorter', () => {
    const { getByText } = render(<SellSorters />)
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

    const { getByText } = render(<SellSorters />)
    const applyButton = getByText('apply')

    fireEvent.press(applyButton)

    await waitFor(() => {
      expect(queryClient.getQueryState(['matches'])?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(['matches', sellOffer.id])?.isInvalidated).toBe(true)
      expect(queryClient.getQueryState(['matches', sellOffer.id, 'bestReputation'])?.isInvalidated).toBe(true)
    })
  })

  it('should close the popup', () => {
    const { getByText } = render(<SellSorters />)
    const applyButton = getByText('apply')

    fireEvent.press(applyButton)
    expect(closePopup).toHaveBeenCalled()
  })
})
