import { createPeachAccount } from './createPeachAccount'

describe('createPeachAccount', () => {
  it('creates a peach account with mnemonic', () => {
    const peachAccount = createPeachAccount('mom mom mom mom mom mom mom mom mom mom mom mom')

    expect(peachAccount.toBase58()).toEqual(
      'tprv8i15NMHNBHLkfV7GSgjTaQ6PZ23RS3zNFax2ZsUjW7k6hG4WCNDK3taEjeUYMNMKr4Ed3AHaKPzNufYkTSYtp6LnMx5Uaoze63fnd4erNnf',
    )
  })
})
