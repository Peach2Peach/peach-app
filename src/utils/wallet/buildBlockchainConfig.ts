import { BLOCKEXPLORER, NODE_TYPE } from '@env'
import {
  BlockChainNames,
  BlockchainElectrumConfig,
  BlockchainEsploraConfig,
  BlockchainRpcConfig,
  Network,
} from 'bdk-rn/lib/lib/enums'
import { addProtocol } from '../web'
import { NodeConfig } from './nodeConfigStore'

const DEFAULT_GAP_LIMIT = 25
const configBuilders = {
  [BlockChainNames.Esplora]: ({ ssl, url, gapLimit }: NodeConfig): BlockchainEsploraConfig => ({
    baseUrl: addProtocol(url || BLOCKEXPLORER, ssl ? 'https' : 'http'),
    proxy: null,
    concurrency: 1,
    timeout: 30,
    stopGap: gapLimit || DEFAULT_GAP_LIMIT,
  }),
  [BlockChainNames.Electrum]: ({ ssl, url, gapLimit }: NodeConfig): BlockchainElectrumConfig => ({
    url: addProtocol(url || BLOCKEXPLORER, ssl ? 'ssl' : 'tcp'),
    sock5: null,
    retry: 1,
    timeout: 5,
    stopGap: gapLimit || DEFAULT_GAP_LIMIT,
    validateDomain: false,
  }),
  [BlockChainNames.Rpc]: ({ url }: NodeConfig): BlockchainRpcConfig => ({
    url: url || BLOCKEXPLORER,
    walletName: 'peach',
    network: Network.Bitcoin,
  }),
}
export const buildBlockchainConfig = (nodeConfig: NodeConfig) => {
  if (nodeConfig.enabled && nodeConfig.url) return configBuilders[nodeConfig.type || NODE_TYPE](nodeConfig)
  return configBuilders[NODE_TYPE]({ enabled: false, ssl: true })
}
