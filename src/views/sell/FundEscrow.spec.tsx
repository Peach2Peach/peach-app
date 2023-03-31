import FundEscrow from './FundEscrow'
import { createRenderer } from 'react-test-renderer/shallow'

const useMockFundEscrowSetup = jest.fn()
jest.mock('./hooks/useFundEscrowSetup', () => ({
  useFundEscrowSetup: () => useMockFundEscrowSetup(),
}))

describe('FundEscrow', () => {
  const defaultReturnValue = {
    sellOffer: {
      id: '123',
      amount: 100000,
    },
    updatePending: false,
    showRegtestButton: false,
    escrow: '123',
    fundingStatus: {
      status: 'FUNDED',
    },
    fundingAmount: 100000,
    fundEscrowAddress: jest.fn(),
  }
  const renderer = createRenderer()

  it('should render the FundEscrow view', () => {
    useMockFundEscrowSetup.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show Loading, while an update is pending', () => {
    useMockFundEscrowSetup.mockReturnValueOnce({
      ...defaultReturnValue,
      updatePending: true,
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show NoEscrowFound, if no sellOffer.id is present', () => {
    useMockFundEscrowSetup.mockReturnValueOnce({
      ...defaultReturnValue,
      sellOffer: {
        ...defaultReturnValue.sellOffer,
        id: '',
      },
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show NoEscrowFound, if no escrow is present', () => {
    useMockFundEscrowSetup.mockReturnValueOnce({
      ...defaultReturnValue,
      escrow: '',
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show NoEscrowFound, if no fundingStatus is present', () => {
    useMockFundEscrowSetup.mockReturnValueOnce({
      ...defaultReturnValue,
      fundingStatus: null,
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show TransactionInMempool, if fundingStatus is MEMPOOL', () => {
    useMockFundEscrowSetup.mockReturnValueOnce({
      ...defaultReturnValue,
      fundingStatus: {
        status: 'MEMPOOL',
      },
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
