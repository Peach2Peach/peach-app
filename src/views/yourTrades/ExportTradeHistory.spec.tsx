import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { fireEvent, render, waitFor } from 'test-utils'
import { ContractSummary } from '../../../peach-api/src/@types/contract'
import { OfferSummary } from '../../../peach-api/src/@types/offer'
import { tradeSummary } from '../../../tests/unit/data/tradeSummaryData'
import { MSINAMONTH } from '../../constants'
import { ExportTradeHistory } from './ExportTradeHistory'

const useTradeSummariesMock = jest.fn((): { tradeSummaries: (OfferSummary | ContractSummary)[] } => ({
  tradeSummaries: [],
}))

jest.mock('../../hooks/query/useTradeSummaries', () => ({
  useTradeSummaries: () => useTradeSummariesMock(),
}))

describe('ExportTradeHistory', () => {
  const firstCSVRow = 'Date, Trade ID, Type, Amount, Price, Currency\n'
  it('should render correctly', () => {
    const { toJSON } = render(<ExportTradeHistory />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should create a csv with correct columns', () => {
    const { getByText } = render(<ExportTradeHistory />)
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    expect(RNFS.writeFile).toHaveBeenCalledWith('DDirPath//trade-history.csv', firstCSVRow, 'utf8')
  })
  it('should add a row for each transaction', () => {
    const dateLastTrade = new Date(tradeSummary.lastModified.getTime() - MSINAMONTH)
    useTradeSummariesMock.mockReturnValueOnce({
      tradeSummaries: [
        tradeSummary,
        { ...tradeSummary, id: '1-2', currency: 'EUR', price: 10, creationDate: dateLastTrade },
      ],
    })
    const { getByText } = render(<ExportTradeHistory />)
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      'DDirPath//trade-history.csv',
      `${firstCSVRow}02/12/2022, PC-1-2, sold, 50000, 10.00, EUR\n01/01/2023, P-27D, canceled, 50000, , \n`,
      'utf8',
    )
  })

  it('should open the native share sheet when the export button is pressed', async () => {
    const { getByText } = render(<ExportTradeHistory />)
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
