import { renderHook } from '@testing-library/react-hooks'
import { contract } from '../../tests/unit/data/contractData'
import { ContractStore, contractStore, useContractStore } from './contractStore'

describe('contractStore', () => {
  afterEach(() => {
    contractStore.getState().reset()
  })
  it('returns an empty object if no contracts have been stored', () => {
    expect(contractStore.getState().getContracts()).toEqual({})
  })
  it('returns undefined if no contracts have been stored', () => {
    expect(contractStore.getState().getContract('1')).toBeUndefined()
  })
  it('sets and gets a contract', () => {
    contractStore.getState().setContract(contract)
    expect(contractStore.getState().getContract(contract.id)).toEqual(contract)
  })
  it('overwrites a set contract', () => {
    const updatedContract = {
      ...contract,
      disputeActive: true,
    }
    contractStore.getState().setContract(contract)
    contractStore.getState().setContract(updatedContract)
    expect(contractStore.getState().getContract(contract.id)).toEqual(updatedContract)
  })
  it('updates an existing contract', () => {
    contractStore.getState().setContract(contract)
    contractStore.getState().updateContract(contract.id, {
      disputeActive: true,
    })
    expect(contractStore.getState().getContract(contract.id)).toEqual({
      ...contract,
      disputeActive: true,
    })
  })
  it('does not set a partial contract if it does not exists', () => {
    contractStore.getState().updateContract(contract.id, {
      disputeActive: true,
    })
    expect(contractStore.getState().getContract(contract.id)).toBeUndefined()
  })

  it('returns a hook to use the store', () => {
    const { result } = renderHook((selector) => useContractStore(selector), {
      initialProps: (state: ContractStore) => state,
    })

    expect(result.current.contracts).toBeInstanceOf(Object)
    expect(result.current.setContract).toBeInstanceOf(Function)
  })
})
