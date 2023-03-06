import 'react-native-url-polyfill/auto'

type BitcoinRequest = {
  address?: string
  amount?: number
  message?: string
  time?: number
  exp?: number
}

/**
 * @description Method to parse a bitcoin request string
 * @param request the bitcoin request
 * @returns structured bitcoin request
 */
export const parseBitcoinRequest = (request: string = 'bitcoin:'): BitcoinRequest => {
  let urn: URL
  const parsedRequest: BitcoinRequest = {}

  try {
    urn = new URL(request)
  } catch (e) {
    urn = new URL('bitcoin:')
  }
  const isLightning = /^ln/u.exec(request)
  const address = /^(?:bc1|tb1|bcrt1|[123])[a-zA-HJ-NP-Z0-9]{25,62}/u.exec(String(request.split(':').pop()))

  if (address && !isLightning) parsedRequest.address = address[0]
  if (urn.searchParams.get('amount')) parsedRequest.amount = Number(urn.searchParams.get('amount'))
  if (urn.searchParams.get('message')) parsedRequest.message = urn.searchParams.get('message') || ''
  if (urn.searchParams.get('time')) parsedRequest.time = Number(urn.searchParams.get('time'))
  if (urn.searchParams.get('exp')) parsedRequest.exp = Number(urn.searchParams.get('exp'))

  return parsedRequest
}
