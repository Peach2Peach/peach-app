import { Blockchain } from 'bdk-rn'
import { BlockChainNames, BlockchainElectrumConfig, BlockchainEsploraConfig } from 'bdk-rn/lib/lib/enums'
import { info } from '../../../utils/log'
import { parseError } from '../../../utils/result'
import { addProtocol } from '../../../utils/web'

const checkElectrumConnection = async (address: string, ssl: boolean) => {
  const config: BlockchainElectrumConfig = {
    url: addProtocol(address, ssl ? 'ssl' : 'tcp'),
    sock5: null,
    retry: 1,
    timeout: 5,
    stopGap: 1,
    validateDomain: false,
  }

  try {
    info('Checking electrum connection...')
    const blockchain = await new Blockchain().create(config, BlockChainNames.Electrum)
    await blockchain.getBlockHash()
    return { result: BlockChainNames.Electrum }
  } catch (e) {
    info('electrum connection failed')
    return { error: parseError(e) }
  }
}
const checkEsploraConnection = async (address: string, ssl: boolean) => {
  const config: BlockchainEsploraConfig = {
    baseUrl: addProtocol(address, ssl ? 'https' : 'http'),
    proxy: null,
    concurrency: 1,
    timeout: 5,
    stopGap: 1,
  }

  try {
    info('Checking esplora connection...')
    const blockchain = await new Blockchain().create(config, BlockChainNames.Esplora)
    await blockchain.getBlockHash()
    return { result: BlockChainNames.Esplora }
  } catch (e) {
    info('esplora connection failed')
    return { error: parseError(e) }
  }
}
const connectionChecks = [checkElectrumConnection, checkEsploraConnection]
export const checkNodeConnection = async (address: string, ssl = false) => {
  const errors: unknown[] = []
  for (const connectionCheck of connectionChecks) {
    // eslint-disable-next-line no-await-in-loop
    const { result, error } = await connectionCheck(address, ssl)
    if (result) return { result }
    errors.push(error)
  }
  return { error: errors.join('\n\n') }
}
