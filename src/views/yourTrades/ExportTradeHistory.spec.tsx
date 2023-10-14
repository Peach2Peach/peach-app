import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { fireEvent, render, waitFor } from 'test-utils'
import { tradeSummary } from '../../../tests/unit/data/tradeSummaryData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/CustomWrapper'
import { ExportTradeHistory } from './ExportTradeHistory'

const useTradeSummariesMock = jest.fn((): { tradeSummaries: (OfferSummary | ContractSummary)[] } => ({
  tradeSummaries: [],
}))

jest.mock('../../hooks/query/useTradeSummaries', () => ({
  useTradeSummaries: () => useTradeSummariesMock(),
}))

describe('ExportTradeHistory', () => {
  const firstCSVRow = 'Date, Trade ID, Type, Amount, Price\n'
  it('should render correctly', () => {
    const { toJSON } = render(<ExportTradeHistory />, { wrapper: NavigationAndQueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should create a csv with date, type, amount, and transaction ID', () => {
    const { getByText } = render(<ExportTradeHistory />, { wrapper: NavigationAndQueryClientWrapper })
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    expect(RNFS.writeFile).toHaveBeenCalledWith('DDirPath//trade-history.csv', firstCSVRow, 'utf8')
  })
  it('should add a row for each transaction', () => {
    useTradeSummariesMock.mockReturnValueOnce({
      tradeSummaries: [tradeSummary],
    })
    const { getByText } = render(<ExportTradeHistory />, { wrapper: NavigationAndQueryClientWrapper })
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      'DDirPath//trade-history.csv',
      `${firstCSVRow}01 / 01 / 23, P-27D, canceled, 50 000, \n`,
      'utf8',
    )
  })

  it('should open the native share sheet when the export button is pressed', async () => {
    const { getByText } = render(<ExportTradeHistory />, { wrapper: NavigationAndQueryClientWrapper })
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    await waitFor(() => {
      expect(Share.open).toHaveBeenCalledWith({
        title: 'trade-history.csv',
        url: 'file://DDirPath//trade-history.csv',
      })
    })
  })
})
