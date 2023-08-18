import { render } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { ExportTransactionHistory } from './ExportTransactionHistory'

describe('ExportTransactionHistory', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ExportTransactionHistory />, { wrapper: NavigationAndQueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it.todo('should open the native share sheet when the export button is pressed')
  it.todo('should export the transaction history as a CSV file with date, time, type, amount, and transaction ID')
})
