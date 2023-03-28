import { renderHook } from '@testing-library/react-hooks'
import { contract } from '../../tests/unit/data/contractData'
import { ContractStore, contractStore, useContractStore } from './contractStore'

describe('contractStore', () => {
  afterEach(() => {
    contractStore.getState().reset()
  })
  it('returns an empty array if no contracts have been stored', () => {
    expect(contractStore.getState().getContracts()).toEqual([])
  })
  it('returns undefined if no contracts have been stored', () => {
    expect(contractStore.getState().getContract('1')).toBeUndefined()
  })
  it('sets and gets a contract', () => {
    contractStore.getState().setContract(contract.id, contract)
    expect(contractStore.getState().getContract(contract.id)).toEqual(contract)
  })

  it('returns a hook to use the store', () => {
    const { result } = renderHook((selector) => useContractStore(selector), {
      initialProps: (state: ContractStore) => state,
    })

    expect(result.current.contracts).toBeInstanceOf(Array)
    expect(result.current.setContract).toBeInstanceOf(Function)
  })
})
