import { render } from 'test-utils'
import { contract } from '../../../peach-api/src/testData/contract'
import { setRouteMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { ContractChat } from './ContractChat'

const useContractDetailsMock = jest.fn().mockReturnValue({ contract })
jest.mock('../../hooks/query/useContractDetails', () => ({
  useContractDetails: (...args: unknown[]) => useContractDetailsMock(...args),
}))

describe('ContractChat', () => {
  beforeAll(() => {
    setRouteMock({ name: 'contractChat', key: 'contractChat', params: { contractId: '1-2' } })
  })
  it('should render correct when chat enabled', () => {
    const { toJSON } = render(<ContractChat />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render chat disabled message when disabled', () => {
    useContractDetailsMock.mockReturnValueOnce({ contract: { ...contract, isChatActive: false } })
    const { toJSON } = render(<ContractChat />)
    expect(toJSON()).toMatchSnapshot()
  })
})
