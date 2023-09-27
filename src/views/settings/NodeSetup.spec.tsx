import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { NodeSetup } from './NodeSetup'

const wrapper = NavigationWrapper
const nodeSetup = {
  enabled: false,
  toggleEnabled: jest.fn(),
  ssl: false,
  toggleSSL: jest.fn(),
  isConnected: false,
  address: '',
  setAddress: jest.fn(),
  addressErrors: [],
  pasteAddress: jest.fn(),
  openQRScanner: jest.fn(),
  checkConnection: jest.fn(),
}
const useNodeSetupMock = jest.fn().mockReturnValue(nodeSetup)
jest.mock('./hooks/useNodeSetup', () => ({
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
      address: 'blockstream.info',
      addressErrors: [],
    })
    shallowRenderer.render(<NodeSetup />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should toggle enabled', () => {
    const { queryAllByText } = render(<NodeSetup />, { wrapper })
    fireEvent.press(queryAllByText('use your own node')[1])
    expect(nodeSetup.toggleEnabled).toHaveBeenCalled()
  })
  it('should not be able to toggle ssl if disabled', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: false })
    const { getByText } = render(<NodeSetup />, { wrapper })
    fireEvent.press(getByText('use SSL'))
    expect(nodeSetup.toggleSSL).not.toHaveBeenCalled()
  })
  it('should toggle ssl', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: true })
    const { getByText } = render(<NodeSetup />, { wrapper })
    fireEvent.press(getByText('use SSL'))
    expect(nodeSetup.toggleSSL).toHaveBeenCalled()
  })
  it('should change address', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: true })
    const { getByPlaceholderText } = render(<NodeSetup />, { wrapper })
    fireEvent(getByPlaceholderText('192.168.0.1:50001'), 'onChange', 'blockstream.info')
    expect(nodeSetup.setAddress).toHaveBeenCalledWith('blockstream.info')
  })
  it('should open call checkConnection', () => {
    useNodeSetupMock.mockReturnValueOnce({ ...nodeSetup, enabled: true, address: 'blockstream.info' })
    const { getByText } = render(<NodeSetup />, { wrapper })
    fireEvent.press(getByText('checking connection'))
    expect(nodeSetup.checkConnection).toHaveBeenCalled()
  })
})
