import { render } from 'test-utils'
import { contract } from '../../../tests/unit/data/contractData'
import { ContractActions } from './ContractActions'

const useContractContextMock = jest.fn().mockReturnValue({ contract })
jest.mock('./context/useContractContext', () => ({
  useContractContext: () => useContractContextMock(),
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn().mockReturnValue({ params: { contractId: 'contractId' } }),
}))

jest.useFakeTimers()

describe('ContractActions', () => {
  it('should show the paymentTooLate sliders for the seller', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(1).getTime())
    useContractContextMock.mockReturnValue({
      contract: { ...contract, paymentExpectedBy: new Date(0), paymentMade: null, tradeStatus: 'paymentTooLate' },
      view: 'seller',
    })
    const { toJSON } = render(<ContractActions />)
    expect(toJSON()).toMatchSnapshot()
  })
})
