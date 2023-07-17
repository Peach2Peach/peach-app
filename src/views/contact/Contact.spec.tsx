import ShallowRenderer from 'react-test-renderer/shallow'
import { Contact } from './Contact'

const useContactSetupMock = jest.fn()
jest.mock('./hooks/useContactSetup', () => ({
  useContactSetup: () => useContactSetupMock(),
}))

describe('Contact', () => {
  const renderer = ShallowRenderer.createRenderer()
  const defaultReturnValue = {
    contactReasons: ['bug', 'question'],
    setReason: jest.fn(),
    openTelegram: jest.fn(),
    openDiscord: jest.fn(),
  }
  it('should render correctly', () => {
    useContactSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<Contact />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
