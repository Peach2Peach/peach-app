import { render } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { TransactionBatching } from './TransactionBatching'
expect.extend({ toMatchDiffSnapshot })

const setupMock = {
  isLoading: false,
  isBatchingEnabled: true,
  togglebatching: jest.fn(),
}
const useTransactionBatchingSetupMock = jest.fn().mockReturnValue(setupMock)
jest.mock('./hooks/useTransactionBatchingSetup', () => ({
  useTransactionBatchingSetup: () => useTransactionBatchingSetupMock(),
}))

describe('TransactionBatching', () => {
  it('should render correctly when batching is enabled', () => {
    const { toJSON } = render(<TransactionBatching />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when batching is disabled', () => {
    const enabled = render(<TransactionBatching />, { wrapper: NavigationWrapper }).toJSON()
    useTransactionBatchingSetupMock.mockReturnValueOnce({ ...setupMock, isBatchingEnabled: false })
    const { toJSON } = render(<TransactionBatching />, { wrapper: NavigationWrapper })
    expect(enabled).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when loading', () => {
    useTransactionBatchingSetupMock.mockReturnValueOnce({ ...setupMock, isLoading: true })

    const { toJSON } = render(<TransactionBatching />)
    expect(toJSON()).toMatchSnapshot()
  })
})
