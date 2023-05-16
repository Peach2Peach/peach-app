import { TradeSeparator } from './TradeSeparator'
import { createRenderer } from 'react-test-renderer/shallow'

const useContractContextMock = jest.fn()
jest.mock('../../views/contract/context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('TradeSeparator', () => {
  const renderer = createRenderer()
  const defaultContract = { disputeActive: false }
  it('renders correctly', () => {
    useContractContextMock.mockReturnValueOnce({ contract: defaultContract, view: 'buyer' })
    renderer.render(<TradeSeparator />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with disputeActive', () => {
    useContractContextMock.mockReturnValueOnce({ contract: { ...defaultContract, disputeActive: true }, view: 'buyer' })
    renderer.render(<TradeSeparator />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with icon', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: { ...defaultContract, canceled: true },
      view: 'buyer',
    })
    renderer.render(<TradeSeparator />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
