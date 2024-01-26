import { networks } from 'bitcoinjs-lib'
import { networks as liquidNetworks } from 'liquidjs-lib'
import { getNetwork } from './getNetwork'

export const getLiquidNetwork = () => {
  const bitcoinNetwork = getNetwork()
  if (bitcoinNetwork === networks.testnet) return liquidNetworks.testnet
  if (bitcoinNetwork === networks.regtest) return liquidNetworks.regtest
  return liquidNetworks.liquid
}
