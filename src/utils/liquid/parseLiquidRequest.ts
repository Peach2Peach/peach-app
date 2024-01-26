import { networks } from 'liquidjs-lib'
import 'react-native-url-polyfill/auto'
import { isLiquidAddress } from '../validation/rules'


type LiquidNetworkRequest = {
  address?: string
  assetId?: string
  amount?: number
  message?: string
  label?: string
  time?: number
  exp?: number
}

export const parseLiquidRequest = (request = 'liquidnetwork:', network: networks.Network = networks.liquid) => {
  let urn: URL
  const parsedRequest: LiquidNetworkRequest = {}

  try {
    urn = new URL(request)
  } catch (e) {
    urn = new URL('liquidnetwork:')
  }


  const address = request.split(':').pop()
    ?.split('?')
    .shift() ?? ''

  if (!isLiquidAddress(address, network)) return {}

  parsedRequest.address = address
  if (urn.searchParams.get('assetid')) parsedRequest.assetId = urn.searchParams.get('assetid') || undefined
  if (urn.searchParams.get('amount')) parsedRequest.amount = Number(urn.searchParams.get('amount'))
  if (urn.searchParams.get('message')) parsedRequest.message = urn.searchParams.get('message') || ''
  if (urn.searchParams.get('label')) parsedRequest.label = urn.searchParams.get('label') || ''
  if (urn.searchParams.get('time')) parsedRequest.time = Number(urn.searchParams.get('time'))
  if (urn.searchParams.get('exp')) parsedRequest.exp = Number(urn.searchParams.get('exp'))

  return parsedRequest
}
