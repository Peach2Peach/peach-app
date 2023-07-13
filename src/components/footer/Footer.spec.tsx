import { createRenderer } from 'react-test-renderer/shallow'
import { Footer } from './Footer'

const useKeyboardMock = jest.fn()
jest.mock('../../hooks/useKeyboard', () => ({
  useKeyboard: () => useKeyboardMock(),
}))

const navigate = {
  buy: jest.fn(),
  sell: jest.fn(),
  wallet: jest.fn(),
  yourTrades: jest.fn(),
  settings: jest.fn(),
}
const useFooterSetupMock = jest.fn().mockReturnValue({ navigate, notifications: 9 })
jest.mock('./hooks/useFooterSetup', () => ({
  useFooterSetup: () => useFooterSetupMock(),
}))

describe('Footer', () => {
  const setCurrentPageMock = jest.fn()
  const renderer = createRenderer()
  it('should render a Footer', () => {
    renderer.render(<Footer currentPage="buy" setCurrentPage={setCurrentPageMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render a Footer with inverted theme', () => {
    renderer.render(<Footer currentPage="buy" setCurrentPage={setCurrentPageMock} theme="inverted" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should not render a Footer with keyboard open', () => {
    useKeyboardMock.mockReturnValueOnce(true)
    renderer.render(<Footer currentPage="buy" setCurrentPage={setCurrentPageMock} theme="inverted" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly on the premium page', () => {
    renderer.render(<Footer currentPage="premium" setCurrentPage={setCurrentPageMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
