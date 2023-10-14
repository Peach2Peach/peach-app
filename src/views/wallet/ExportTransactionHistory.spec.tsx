import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { fireEvent, render, waitFor } from 'test-utils'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/CustomWrapper'
import { useWalletState } from '../../utils/wallet/walletStore'
import { ExportTransactionHistory } from './ExportTransactionHistory'

describe('ExportTransactionHistory', () => {
  const firstCSVRow = 'Date, Type, Amount, Transaction ID\n'
  it('should render correctly', () => {
    const { toJSON } = render(<ExportTransactionHistory />, { wrapper: NavigationAndQueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should create a csv with date, type, amount, and transaction ID', () => {
    const { getByText } = render(<ExportTransactionHistory />, { wrapper: NavigationAndQueryClientWrapper })
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    expect(RNFS.writeFile).toHaveBeenCalledWith('DDirPath//transaction-history.csv', firstCSVRow, 'utf8')
  })
  it('should add a row for each transaction', () => {
    useWalletState.setState({
      transactions: [
        {
          txid: '1',
          sent: 21000,
          received: 210000,
        },
        {
          txid: '2',
          sent: 42000,
          received: 0,
        },
      ],
      txOfferMap: {
        '1': ['1'],
        '2': ['2'],
      },
    })
    const { getByText } = render(<ExportTransactionHistory />, { wrapper: NavigationAndQueryClientWrapper })
    const exportButton = getByText('export')
    const DATE_TO_USE = new Date('2023-08-18T17:50:25.000Z')
    DATE_TO_USE.toLocaleString = jest.fn(() => '8/18/2023 5:50:25 PM')
    jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)

    fireEvent.press(exportButton)

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      'DDirPath//transaction-history.csv',
      `${firstCSVRow}8/18/2023 5:50:25 PM, WITHDRAWAL, 189000, 1\n8/18/2023 5:50:25 PM, WITHDRAWAL, 42000, 2\n`,
      'utf8',
    )
  })

  it('should open the native share sheet when the export button is pressed', async () => {
    const { getByText } = render(<ExportTransactionHistory />, { wrapper: NavigationAndQueryClientWrapper })
    const exportButton = getByText('export')

    fireEvent.press(exportButton)

    await waitFor(() => {
      expect(Share.open).toHaveBeenCalledWith({
        title: 'transaction-history.csv',
        url: 'file://DDirPath//transaction-history.csv',
      })
    })
  })
})
