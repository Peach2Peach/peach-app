import { createRenderer } from 'react-test-renderer/shallow'
import { contract } from '../../../../tests/unit/data/contractData'
import { MSINADAY } from '../../../constants'
import { ContractStatusInfo } from './ContractStatusInfo'

const now = new Date('2020-01-01')
jest.useFakeTimers({ now })

const useContractContextMock = jest.fn()
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('ContractStatusInfo', () => {
  const renderer = createRenderer()

  it('renders correctly for buyer when requiredAction is sendPayment and paymentExpectedBy is in the future', () => {
    const activeContract = { ...contract, paymentExpectedBy: new Date(now.getTime() + MSINADAY) }
    useContractContextMock.mockReturnValueOnce({ contract: activeContract, view: 'buyer' })

    renderer.render(<ContractStatusInfo requiredAction="sendPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for buyer when requiredAction is sendPayment and paymentExpectedBy is in the past', () => {
    const pastContract = { ...contract, paymentExpectedBy: new Date(now.getTime() - MSINADAY) }
    useContractContextMock.mockReturnValueOnce({ contract: pastContract, view: 'buyer' })

    renderer.render(<ContractStatusInfo requiredAction="sendPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for buyer when requiredAction is confirmPayment', () => {
    useContractContextMock.mockReturnValueOnce({ contract, view: 'buyer' })

    renderer.render(<ContractStatusInfo requiredAction="confirmPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for seller when requiredAction is confirmPayment', () => {
    useContractContextMock.mockReturnValueOnce({
      contract,
      view: 'seller',
    })

    renderer.render(<ContractStatusInfo requiredAction="confirmPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when contract is in dispute', () => {
    const disputeContract = { ...contract, disputeActive: true }
    useContractContextMock.mockReturnValueOnce({ contract: disputeContract })

    renderer.render(<ContractStatusInfo requiredAction="sendPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for seller when cancellation is pending', () => {
    const cancellationContract = { ...contract, cancelationRequested: true }
    useContractContextMock.mockReturnValueOnce({ contract: cancellationContract })

    renderer.render(<ContractStatusInfo requiredAction="sendPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when cancel trade request confirmation is required from buyer', () => {
    const cancelTradeRequestContract = { ...contract, cancelationRequested: true }
    useContractContextMock.mockReturnValueOnce({ contract: cancelTradeRequestContract })

    renderer.render(<ContractStatusInfo requiredAction="sendPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when payment method is cash trade', () => {
    const cashTradeContract: Contract = { ...contract, paymentMethod: 'cash.de.berlin' }
    useContractContextMock.mockReturnValueOnce({ contract: cashTradeContract })

    renderer.render(<ContractStatusInfo requiredAction="sendPayment" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
