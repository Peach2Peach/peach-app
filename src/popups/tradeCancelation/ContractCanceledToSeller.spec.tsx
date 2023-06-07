import { createRenderer } from 'react-test-renderer/shallow'
import { contract } from '../../../tests/unit/data/contractData'
import { ContractCanceledToSeller } from './ContractCanceledToSeller'

const expired = {
  date: new Date(),
  ttl: 0,
  isExpired: true,
}
const notExpired = {
  date: new Date(),
  ttl: 0,
  isExpired: false,
}
const getEscrowExpiryMock = jest.fn().mockReturnValue(notExpired)
jest.mock('../../utils/offer/getEscrowExpiry', () => ({
  getEscrowExpiry: () => getEscrowExpiryMock(),
}))
describe('ContractCanceledToSeller', () => {
  const canceledByBuyer: Contract = { ...contract, canceledBy: 'buyer' }
  const canceledBySeller: Contract = { ...contract, canceledBy: 'seller' }
  const canceledByMediator: Contract = { ...contract, canceledBy: 'mediator' }

  it('should render correctly for seller when buyer canceled', () => {
    const renderer = createRenderer()
    renderer.render(<ContractCanceledToSeller contract={canceledByBuyer} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller when buyer canceled with expired escrow', () => {
    getEscrowExpiryMock.mockReturnValueOnce(expired)
    const renderer = createRenderer()
    renderer.render(<ContractCanceledToSeller contract={canceledByBuyer} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller when seller canceled', () => {
    const renderer = createRenderer()
    renderer.render(<ContractCanceledToSeller contract={canceledBySeller} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller when seller canceled with expired escrow', () => {
    getEscrowExpiryMock.mockReturnValueOnce(expired)
    const renderer = createRenderer()
    renderer.render(<ContractCanceledToSeller contract={canceledBySeller} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller when mediator canceled', () => {
    const renderer = createRenderer()
    renderer.render(<ContractCanceledToSeller contract={canceledByMediator} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller when mediator canceled with expired escrow', () => {
    getEscrowExpiryMock.mockReturnValueOnce(expired)
    const renderer = createRenderer()
    renderer.render(<ContractCanceledToSeller contract={canceledByMediator} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
