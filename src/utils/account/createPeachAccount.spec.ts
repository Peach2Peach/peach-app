import { base58_12xmom } from '../../../tests/unit/data/accountData'
import { createWalletFromBase58 } from '../wallet/createWalletFromBase58'
import { getNetwork } from '../wallet/getNetwork'
import { createPeachAccount } from './createPeachAccount'

describe('createPeachAccount', () => {
  const wallet = createWalletFromBase58(base58_12xmom, getNetwork())

  it('creates a peach account with mnemonic', () => {
    const peachAccount = createPeachAccount(wallet)

    expect(peachAccount.toBase58()).toEqual(
      'tprv8i15NMHNBHLkfV7GSgjTaQ6PZ23RS3zNFax2ZsUjW7k6hG4WCNDK3taEjeUYMNMKr4Ed3AHaKPzNufYkTSYtp6LnMx5Uaoze63fnd4erNnf',
    )
  })
})
