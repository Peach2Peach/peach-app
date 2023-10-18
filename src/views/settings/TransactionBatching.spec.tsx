import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
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
    const { toJSON } = render(<TransactionBatching />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when batching is disabled', () => {
    const enabled = render(<TransactionBatching />).toJSON()
    useTransactionBatchingSetupMock.mockReturnValueOnce({ ...setupMock, isBatchingEnabled: false })
    const { toJSON } = render(<TransactionBatching />)
    expect(enabled).toMatchDiffSnapshot(toJSON())
  })
  it('should render correctly when loading', () => {
    useTransactionBatchingSetupMock.mockReturnValueOnce({ ...setupMock, isLoading: true })

    const { toJSON } = render(<TransactionBatching />)
    expect(toJSON()).toMatchSnapshot()
  })
})
