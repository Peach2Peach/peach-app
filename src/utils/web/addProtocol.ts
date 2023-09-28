export const addProtocol = (address: string, protocol: string) => {
  const url = new URL(address.includes('://') ? address : `${protocol}://${address}`)
  url.protocol = protocol

  const urlString = url.toString()

  return urlString.endsWith('/') ? urlString.slice(0, -1) : urlString
}
