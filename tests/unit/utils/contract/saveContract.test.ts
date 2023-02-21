import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { saveContract } from '../../../../src/utils/contract'
import * as accountData from '../../data/accountData'
import * as contractData from '../../data/contractData'

jest.mock('react-native-fs', () => ({
  readFile: async (): Promise<string> => JSON.stringify(accountData.account1),
  writeFile: async (): Promise<void> => {},
  unlink: async (): Promise<void> => {},
}))

// eslint-disable-next-line max-lines-per-function
describe('saveContract', () => {
  it('adds a new contract to account', async () => {
    await setAccount({ ...defaultAccount, contracts: [] })

    saveContract(contractData.contract)
    expect(account.contracts[0]).toEqual(contractData.contract)
  })
  it('updates an existing contract on account', async () => {
    await setAccount({ ...defaultAccount, contracts: [contractData.contract] })

    const now = new Date()
    saveContract({
      ...contractData.contract,
      paymentMade: now,
    })
    expect(account.contracts.length).toEqual(1)
    expect(account.contracts[0].paymentMade).toEqual(now)
  })
  it('does not falsely update another contract on account', async () => {
    const contract2 = { ...contractData.contract, id: '34-45' }
    await setAccount({
      ...defaultAccount,
      contracts: [contractData.contract, contract2],
    })

    saveContract({
      ...contractData.contract,
    })
    expect(account.contracts.length).toEqual(2)
    expect(account.contracts[1]).toEqual(contract2)
  })

  it('ensures that disputeResultAcknowledged is false when dispute is active', async () => {
    await setAccount({ ...defaultAccount, contracts: [{ ...contractData.contract, disputeResultAcknowledged: true }] })

    saveContract({
      ...contractData.contract,
      disputeActive: true,
    })
    expect(account.contracts[0].disputeResultAcknowledged).toEqual(false)
  })
  it('ensures that disputeResultAcknowledged is false when not acknowledged', async () => {
    await setAccount({ ...defaultAccount, contracts: [{ ...contractData.contract, disputeResultAcknowledged: false }] })

    saveContract({
      ...contractData.contract,
      disputeResultAcknowledged: false,
    })
    expect(account.contracts[0].disputeResultAcknowledged).toEqual(false)
  })
  it('ensures that disputeResultAcknowledged is true when already acknowledged', async () => {
    await setAccount({ ...defaultAccount, contracts: [{ ...contractData.contract, disputeResultAcknowledged: true }] })

    saveContract({
      ...contractData.contract,
      disputeResultAcknowledged: false,
    })
    expect(account.contracts[0].disputeResultAcknowledged).toEqual(true)
  })
  it('ensures that disputeResultAcknowledged is true when now acknowledged', async () => {
    await setAccount({ ...defaultAccount, contracts: [{ ...contractData.contract, disputeResultAcknowledged: false }] })

    saveContract({
      ...contractData.contract,
      disputeResultAcknowledged: true,
    })
    expect(account.contracts[0].disputeResultAcknowledged).toEqual(true)
  })
  it('ensures that disputeAcknowledgedByCounterParty is false when dispute is  not active', async () => {
    await setAccount({
      ...defaultAccount,
      contracts: [{ ...contractData.contract, disputeAcknowledgedByCounterParty: true }],
    })

    saveContract({
      ...contractData.contract,
      disputeActive: false,
    })
    expect(account.contracts[0].disputeAcknowledgedByCounterParty).toEqual(false)
  })
  it('ensures that disputeAcknowledgedByCounterParty is false when not acknowledged during dispute', async () => {
    await setAccount({
      ...defaultAccount,
      contracts: [{ ...contractData.contract, disputeAcknowledgedByCounterParty: false }],
    })

    saveContract({
      ...contractData.contract,
      disputeAcknowledgedByCounterParty: false,
    })
    expect(account.contracts[0].disputeAcknowledgedByCounterParty).toEqual(false)
  })
  it('ensures that disputeAcknowledgedByCounterParty is true when already acknowledged during dispute', async () => {
    await setAccount({
      ...defaultAccount,
      contracts: [{ ...contractData.contract, disputeAcknowledgedByCounterParty: true }],
    })

    saveContract({
      ...contractData.contract,
      disputeActive: true,
      disputeAcknowledgedByCounterParty: false,
    })
    expect(account.contracts[0].disputeAcknowledgedByCounterParty).toEqual(true)
  })
  it('ensures that disputeAcknowledgedByCounterParty is true when now acknowledged during dispute', async () => {
    await setAccount({
      ...defaultAccount,
      contracts: [{ ...contractData.contract, disputeAcknowledgedByCounterParty: false }],
    })

    saveContract({
      ...contractData.contract,
      disputeActive: true,
      disputeAcknowledgedByCounterParty: true,
    })
    expect(account.contracts[0].disputeAcknowledgedByCounterParty).toEqual(true)
  })
})
