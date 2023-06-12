import { Linking } from 'react-native'
import { showTransaction } from './showTransaction'

describe('showTransaction', () => {
  const openURLSpy = jest.spyOn(Linking, 'openURL')

  it('links to mainnet blockexplorer', () => {
    showTransaction('txId', 'bitcoin')
    expect(openURLSpy).toHaveBeenCalledWith('https://mempool.space/tx/txId')
  })
  it('links to testnet blockexplorer', () => {
    showTransaction('txId', 'testnet')
    expect(openURLSpy).toHaveBeenCalledWith('https://mempool.space/testnet/tx/txId')
  })
  it('links to regtest blockexplorer', () => {
    showTransaction('txId', 'regtest')
    expect(openURLSpy).toHaveBeenCalledWith('https://localhost:3000/tx/txId')
  })
})
