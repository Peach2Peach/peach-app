import { contract } from '../../../../tests/unit/data/contractData'
import { MSINADAY } from '../../../constants'
import { ContractStatusInfo } from './ContractStatusInfo'
import { createRenderer } from 'react-test-renderer/shallow'

const now = new Date('2020-01-01')
jest.useFakeTimers({ now })

describe('ContractStatusInfo', () => {
  const renderer = createRenderer()
  it('renders correctly for buyer when requiredAction is sendPayment and paymentExpectedBy is in the future', () => {
    const activeContract = { ...contract, paymentExpectedBy: new Date(now.getTime() + MSINADAY) }
    renderer.render(<ContractStatusInfo contract={activeContract} requiredAction="sendPayment" view="buyer" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for buyer when requiredAction is sendPayment and paymentExpectedBy is in the past', () => {
    const pastContract = { ...contract, paymentExpectedBy: new Date(now.getTime() - MSINADAY) }
    renderer.render(<ContractStatusInfo contract={pastContract} requiredAction="sendPayment" view="buyer" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for buyer when requiredAction is confirmPayment', () => {
    renderer.render(<ContractStatusInfo contract={contract} requiredAction="confirmPayment" view="buyer" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for seller when requiredAction is confirmPayment', () => {
    renderer.render(<ContractStatusInfo contract={contract} requiredAction="confirmPayment" view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when contract is in dispute', () => {
    const disputeContract = { ...contract, disputeActive: true }
    renderer.render(<ContractStatusInfo contract={disputeContract} requiredAction="sendPayment" view="buyer" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly for seller when cancellation is pending', () => {
    const cancellationContract = { ...contract, cancelationRequested: true }
    renderer.render(<ContractStatusInfo contract={cancellationContract} requiredAction="sendPayment" view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when cancel trade request confirmation is required from buyer', () => {
    const cancelTradeRequestContract = { ...contract, cancelationRequested: true }
    renderer.render(
      <ContractStatusInfo contract={cancelTradeRequestContract} requiredAction="sendPayment" view="buyer" />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when payment method is cash trade', () => {
    const cashTradeContract: Contract = { ...contract, paymentMethod: 'cash.de.berlin' }
    renderer.render(<ContractStatusInfo contract={cashTradeContract} requiredAction="sendPayment" view="buyer" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
