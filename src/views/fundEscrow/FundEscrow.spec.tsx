import FundEscrow from '../fundEscrow/FundEscrow'
import { createRenderer } from 'react-test-renderer/shallow'

const useFundEscrowSetupMock = jest.fn()
jest.mock('./hooks/useFundEscrowSetup', () => ({
  useFundEscrowSetup: () => useFundEscrowSetupMock(),
}))
const useAutoFundOfferSetupMock = jest.fn().mockReturnValue({
  showRegtestButton: false,
  fundEscrowAddress: jest.fn(),
})
jest.mock('./hooks/regtest/useAutoFundOffer', () => ({
  useAutoFundOffer: () => useAutoFundOfferSetupMock(),
}))

describe('FundEscrow', () => {
  const defaultReturnValue = {
    offerId: '123',
    escrow: '123',
    fundingStatus: {
      status: 'NULL',
    },
    fundingAmount: 100000,
    createEscrowError: null,
  }
  const renderer = createRenderer()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the FundEscrow view', () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show Loading, while escrow creation is pending', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      escrow: '',
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show NoEscrowFound, if no there is an error while creating escrow', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      escrow: '',
      createEscrowError: new Error('UNAUTHORIZED'),
    })
    renderer.render(<FundEscrow />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should show TransactionInMempool, if fundingStatus is MEMPOOL', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
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
