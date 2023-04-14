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
  it('should render a Footer', () => {
    const renderer = createRenderer()
    renderer.render(<Footer active="buy" setCurrentPage={setCurrentPageMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render a Footer with inverted theme', () => {
    const renderer = createRenderer()
    renderer.render(<Footer active="buy" setCurrentPage={setCurrentPageMock} theme="inverted" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should not render a Footer with keyboard open', () => {
    useKeyboardMock.mockReturnValueOnce(true)
    const renderer = createRenderer()
    renderer.render(<Footer active="buy" setCurrentPage={setCurrentPageMock} theme="inverted" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
