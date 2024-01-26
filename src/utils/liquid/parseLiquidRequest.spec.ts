import { deepStrictEqual } from 'assert'
import { networks } from 'liquidjs-lib'
import { liquidAddresses } from '../../../tests/unit/data/liquidNetworkData'
import { parseLiquidRequest } from './parseLiquidRequest'

// eslint-disable-next-line max-lines-per-function
describe('parseLiquidRequest', () => {
  const address = liquidAddresses.liquid[0]
  const testnetAddress = liquidAddresses.testnet[0]
  const amount = 11999
  const assetId = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d'
  const message = 'Test'
  const time = 1649846322
  const exp = 604800
  it('parses valid liquid requests', () => {
    const request
      = `liquidnetwork:${address}?amount=${amount}&assetid=${assetId}&message=${message}&time=${time}&exp=${exp}`
    const parsedRequest = {
      address,
      amount,
      assetId,
      message,
      time,
      exp,
    }
    deepStrictEqual(parseLiquidRequest(request), parsedRequest)
  })

  it('parses valid liquid requests with partial data', () => {
    const request = `liquidnetwork:${address}?amount=${amount}&assetid=${assetId}`
    const parsedRequest = {
      address,
      assetId,
      amount,
    }
    deepStrictEqual(parseLiquidRequest(request), parsedRequest)
  })

  it('parses valid liquid requests with address only', () => {
    const request = `liquidnetwork:${address}?assetid=${assetId}`
    const parsedRequest = { address, assetId }
    deepStrictEqual(parseLiquidRequest(request), parsedRequest)
  })

  it('parses valid liquid requests with testnet address only', () => {
    const request = `liquidnetwork:${testnetAddress}?assetid=${assetId}`
    const parsedRequest = { address: testnetAddress, assetId }
    deepStrictEqual(parseLiquidRequest(request, networks.testnet), parsedRequest)
  })

  it('should return null for invalid requests', () => {
    const request = 'https://peachbitcoin.com'
    const parsedRequest = {}
    deepStrictEqual(parseLiquidRequest(request), parsedRequest)
  })

  it('should return null for empty param', () => {
    deepStrictEqual(parseLiquidRequest(''), {})
  })

})
