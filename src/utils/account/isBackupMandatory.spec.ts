import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { defaultAccount, isBackupMandatory, setAccount } from '.'

describe('isBackupMandatory', () => {
  it('returns true when number of completed trades is equal 3', async () => {
    await setAccount(defaultAccount)
    const contracts: Partial<ContractSummary>[] = [
      { tradeStatus: 'tradeCompleted' },
      { tradeStatus: 'tradeCompleted' },
      { tradeStatus: 'tradeCompleted' },
    ]
    tradeSummaryStore.setState({ contracts: contracts as ContractSummary[] })
    expect(isBackupMandatory()).toBe(true)
  })
  it('returns true when number of completed trades is greater than 3', async () => {
    await setAccount(defaultAccount)

    const contracts: Partial<ContractSummary>[] = [
      { tradeStatus: 'tradeCompleted' },
      { tradeStatus: 'tradeCompleted' },
      { tradeStatus: 'tradeCompleted' },
      { tradeStatus: 'tradeCompleted' },
    ]
    tradeSummaryStore.setState({ contracts: contracts as ContractSummary[] })
    expect(isBackupMandatory()).toBe(true)
  })

  it('returns false when number of completed trades is less than 3', async () => {
    await setAccount(defaultAccount)

    const contracts: Partial<ContractSummary>[] = [{ tradeStatus: 'tradeCompleted' }, { tradeStatus: 'tradeCompleted' }]
    tradeSummaryStore.setState({ contracts: contracts as ContractSummary[] })
    expect(isBackupMandatory()).toBe(false)
  })
})
