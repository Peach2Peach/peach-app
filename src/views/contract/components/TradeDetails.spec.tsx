import { contract as mockContract } from '../../../../tests/unit/data/contractData'
import { TradeDetails } from './TradeDetails'
import { createRenderer } from 'react-test-renderer/shallow'
import { useLocalContractStore } from '../../../store/useLocalContractStore'

const useContractContextMock = jest.fn(() => ({
  contract: mockContract,
  view: 'buyer',
}))
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('TradeDetails', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<TradeDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for past trade', () => {
    useContractContextMock.mockImplementationOnce(() => ({
      contract: { ...mockContract, tradeStatus: 'tradeCompleted', releaseTxId: '123' },
      view: 'seller',
    }))
    renderer.render(<TradeDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show errorBox for missing paymentdata and decryption error', () => {
    useContractContextMock.mockImplementationOnce(() => ({
      contract: { ...mockContract, paymentData: undefined },
      view: 'seller',
    }))
    useLocalContractStore.setState({
      contracts: { [mockContract.id]: { error: 'DECRYPTION_ERROR', id: mockContract.id } },
    })
    renderer.render(<TradeDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
