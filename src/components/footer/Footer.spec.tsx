import { createRenderer } from 'react-test-renderer/shallow'
import { Footer } from './Footer'

const useKeyboardMock = jest.fn()
jest.mock('../../hooks/useKeyboard', () => ({
  useKeyboard: () => useKeyboardMock(),
}))

describe('Footer', () => {
  const renderer = createRenderer()
  it('should render a Footer', () => {
    renderer.render(<Footer />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
