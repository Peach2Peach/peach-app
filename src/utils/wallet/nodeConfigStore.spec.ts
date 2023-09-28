import { NodeConfig, useNodeConfigState } from './nodeConfigStore'

describe('nodeConfigStore', () => {
  afterEach(() => {
    useNodeConfigState.getState().reset()
  })
  it('returns defaults', () => {
    expect(useNodeConfigState.getState()).toEqual({
      ...useNodeConfigState.getState(),
      enabled: false,
      ssl: false,
    })
  })

  it('updates node settings', () => {
    const nodeSettings: NodeConfig = {
      enabled: true,
      address: 'blockstream.info',
      ssl: true,
      type: 'esplora',
    }
    useNodeConfigState.getState().setCustomNode(nodeSettings)
    expect(useNodeConfigState.getState()).toEqual({
      ...useNodeConfigState.getState(),
      ...nodeSettings,
    })
  })
  it('toggles enabled flag', () => {
    expect(useNodeConfigState.getState().enabled).toBeFalsy()
    useNodeConfigState.getState().toggleEnabled()
    expect(useNodeConfigState.getState().enabled).toBeTruthy()
    useNodeConfigState.getState().toggleEnabled()
    expect(useNodeConfigState.getState().enabled).toBeFalsy()
  })
  it('toggles ssl flag', () => {
    expect(useNodeConfigState.getState().ssl).toBeFalsy()
    useNodeConfigState.getState().toggleSSL()
    expect(useNodeConfigState.getState().ssl).toBeTruthy()
    useNodeConfigState.getState().toggleSSL()
    expect(useNodeConfigState.getState().ssl).toBeFalsy()
  })
})
