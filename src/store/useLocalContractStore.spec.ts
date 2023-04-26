import { act, renderHook } from '@testing-library/react-native'
import { contract } from '../../tests/unit/data/contractData'
import { LocalContractStore, useLocalContractStore } from './useLocalContractStore'

describe('useLocalContractStore', () => {
  afterEach(() => {
    act(() => {
      useLocalContractStore.getState().reset()
    })
  })
  it('returns an empty object if no contracts have been stored', () => {
    expect(useLocalContractStore.getState().contracts).toEqual({})
  })
  it('returns undefined if no contracts have been stored', () => {
    expect(useLocalContractStore.getState().contracts['1']).toBeUndefined()
  })
  it('sets and gets a contract', () => {
    useLocalContractStore.getState().setContract(contract)
    expect(useLocalContractStore.getState().contracts[contract.id]).toEqual(contract)
  })
  it('overwrites a set contract', () => {
    const updatedContract = {
      ...contract,
      disputeActive: true,
    }
    useLocalContractStore.getState().setContract(contract)
    useLocalContractStore.getState().setContract(updatedContract)
    expect(useLocalContractStore.getState().contracts[contract.id]).toEqual(updatedContract)
  })
  it('updates an existing contract', () => {
    useLocalContractStore.getState().setContract(contract)
    useLocalContractStore.getState().updateContract(contract.id, {
      hasSeenDisputeEmailPopup: true,
    })
    expect(useLocalContractStore.getState().contracts[contract.id]).toEqual({
      ...contract,
      hasSeenDisputeEmailPopup: true,
    })
  })
  it('creates a new partial contract if it doesn\'t exist', () => {
    useLocalContractStore.getState().updateContract(contract.id, {
      hasSeenDisputeEmailPopup: true,
    })
    expect(useLocalContractStore.getState().contracts[contract.id]).toStrictEqual({
      hasSeenDisputeEmailPopup: true,
    })
  })

  it('sets the migrated flag', () => {
    useLocalContractStore.getState().setMigrated()
    expect(useLocalContractStore.getState().migrated).toBe(true)
  })

  it('sets the hasSeenDisputeEmailPopup flag', () => {
    useLocalContractStore.getState().setContract(contract)
    useLocalContractStore.getState().setHasSeenDisputeEmailPopup(contract.id, false)
    expect(useLocalContractStore.getState().contracts[contract.id].hasSeenDisputeEmailPopup).toBe(false)
  })

  it('sets the hasSeenDisputeEmailPopup flag to true by default', () => {
    useLocalContractStore.getState().setContract({ ...contract, hasSeenDisputeEmailPopup: false })
    useLocalContractStore.getState().setHasSeenDisputeEmailPopup(contract.id)
    expect(useLocalContractStore.getState().contracts[contract.id].hasSeenDisputeEmailPopup).toBe(true)
  })

  it('returns a hook to use the store', () => {
    const { result } = renderHook((selector) => useLocalContractStore(selector), {
      initialProps: (state: LocalContractStore) => state,
    })

    expect(result.current.contracts).toBeInstanceOf(Object)
    expect(result.current.setContract).toBeInstanceOf(Function)
  })
})
