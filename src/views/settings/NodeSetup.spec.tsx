import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { usePopupStore } from '../../store/usePopupStore'
import { NodeSetup } from './NodeSetup'

const url = 'blockstream.info'
const nodeSetup = {
  enabled: false,
  toggleEnabled: jest.fn(),
  ssl: false,
  toggleSSL: jest.fn(),
  isConnected: false,
  url: '',
  setURL: jest.fn(),
  urlErrors: [],
  pasteAddress: jest.fn(),
  openQRScanner: jest.fn(),
  canCheckConnection: false,
  checkConnection: jest.fn(),
  editConfig: jest.fn(),
}
const useNodeSetupMock = jest.fn().mockReturnValue(nodeSetup)
jest.mock('./hooks/nodeSetup/useNodeSetup', () => ({
  useNodeSetup: (...args: unknown[]) => useNodeSetupMock(...args),
}))
describe('NodeSetup', () => {
  const shallowRenderer = createRenderer()
  it('should render with default settings', () => {
    shallowRenderer.render(<NodeSetup />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render with valid node settings', () => {
    useNodeSetupMock.mockReturnValueOnce({
      ...nodeSetup,
      enabled: true,
      ssl: true,
      isConnected: true,
      address: url,
      urlErrors: [],
      canCheckConnection: true,
    })
    shallowRenderer.render(<NodeSetup />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should toggle enabled', () => {
    const { queryAllByText } = render(<NodeSetup />)
    fireEvent.press(queryAllByText('use your own node')[1])
    expect(nodeSetup.toggleEnabled).toHaveBeenCalled()
  })
  it('should not be able to toggle ssl if disabled', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: false })
    const { getByText } = render(<NodeSetup />)
    fireEvent.press(getByText('use SSL'))
    expect(nodeSetup.toggleSSL).not.toHaveBeenCalled()
  })
  it('should toggle ssl', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: true })
    const { getByText } = render(<NodeSetup />)
    fireEvent.press(getByText('use SSL'))
    expect(nodeSetup.toggleSSL).toHaveBeenCalled()
  })
  it('should change address', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: true })
    const { getByPlaceholderText } = render(<NodeSetup />)
    fireEvent(getByPlaceholderText('192.168.0.1:50001'), 'onChange', url)
    expect(nodeSetup.setURL).toHaveBeenCalledWith(url)
  })
  it('should open call checkConnection', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: true, address: url, canCheckConnection: true })
    const { getByText } = render(<NodeSetup />)
    fireEvent.press(getByText('check connection'))
    expect(nodeSetup.checkConnection).toHaveBeenCalled()
  })
  it('should open help popup', () => {
    const { getByAccessibilityHint } = render(<NodeSetup />)

    fireEvent.press(getByAccessibilityHint('help use your own node'))
    expect(render(usePopupStore.getState().popupComponent || <></>)).toMatchSnapshot()
  })
})
