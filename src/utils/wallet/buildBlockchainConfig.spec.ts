import { BlockChainNames } from 'bdk-rn/lib/lib/enums'
import { buildBlockchainConfig } from './buildBlockchainConfig'

describe('buildBlockchainConfig', () => {
  const defaultConfig = {
    retry: 1,
    sock5: null,
    stopGap: 25,
    timeout: 5,
    url: 'https://localhost:3000',
    validateDomain: false,
  }
  it('should return the default config is custom setting is disabled', () => {
    expect(buildBlockchainConfig({ enabled: false, ssl: false })).toEqual({
      type: BlockChainNames.Electrum,
      config: defaultConfig,
    })
  })
  it('should return the default config is custom setting is enabed but no url set', () => {
    expect(buildBlockchainConfig({ enabled: true, ssl: false })).toEqual({
      type: BlockChainNames.Electrum,
      config: defaultConfig,
    })
  })
  it('should return the custom config is custom setting is enabed', () => {
    expect(buildBlockchainConfig({ enabled: true, ssl: false, url: 'url' })).toEqual({
      type: BlockChainNames.Electrum,
      config: {
        ...defaultConfig,
        url: 'tcp://url',
      },
    })
    expect(buildBlockchainConfig({ enabled: true, ssl: true, url: 'url' })).toEqual({
      type: BlockChainNames.Electrum,
      config: {
        ...defaultConfig,
        url: 'ssl://url',
      },
    })
  })
  it('should return the custom config for different node type', () => {
    expect(buildBlockchainConfig({ enabled: true, ssl: true, url: 'url', type: BlockChainNames.Electrum })).toEqual({
      type: BlockChainNames.Electrum,
      config: {
        ...defaultConfig,
        url: 'ssl://url',
      },
    })
    expect(buildBlockchainConfig({ enabled: true, ssl: true, url: 'url', type: BlockChainNames.Esplora })).toEqual({
      type: BlockChainNames.Esplora,
      config: {
        baseUrl: 'https://url',
        concurrency: 1,
        proxy: null,
        stopGap: 25,
        timeout: 30,
      },
    })
    expect(buildBlockchainConfig({ enabled: true, ssl: true, url: 'url', type: BlockChainNames.Rpc })).toEqual({
      type: BlockChainNames.Rpc,
      config: {
        network: 'bitcoin',
        url: 'url',
        walletName: 'peach',
      },
    })
  })
})
