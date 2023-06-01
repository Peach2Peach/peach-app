export const Address = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  scriptPubKey: jest.fn(),
}))
export const Blockchain = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  getHeight: jest.fn(),
  getBlockHash: jest.fn(),
  broadcast: jest.fn(),
  estimateFee: jest.fn(),
}))
export const BumpFeeTxBuilder = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  allowShrinking: jest.fn(),
  enableRbf: jest.fn(),
  enableRbfWithSequence: jest.fn(),
  finish: jest.fn(),
}))
export const DatabaseConfig = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  memory: jest.fn(),
  sled: jest.fn(),
  sqlite: jest.fn(),
}))
export const DerivationPath = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
}))
export const Descriptor = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  asString: jest.fn(),
  asStringPrivate: jest.fn(),
  newBip44: jest.fn(),
  newBip44Public: jest.fn(),
  newBip49: jest.fn(),
  newBip49Public: jest.fn(),
  newBip84: jest.fn(),
  newBip84Public: jest.fn(),
}))
export const DescriptorPublicKey = jest.fn().mockImplementation(() => ({
  fromString: jest.fn(),
  derive: jest.fn(),
  extend: jest.fn(),
  asString: jest.fn(),
}))
export const DescriptorSecretKey = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  derive: jest.fn(),
  extend: jest.fn(),
  asPublic: jest.fn(),
  secretBytes: jest.fn(),
  asString: jest.fn(),
}))
export const Mnemonic = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  fromString: jest.fn(),
  fromEntropy: jest.fn(),
}))
export const PartiallySignedTransaction = jest.fn().mockImplementation(() => ({
  combine: jest.fn(),
  extractTx: jest.fn(),
  serialize: jest.fn(),
  txid: jest.fn(),
  feeAmount: jest.fn(),
  feeRate: jest.fn(),
}))
export const Transaction = jest.fn().mockImplementation(() => ({
  _setTransaction: jest.fn(),
  create: jest.fn().mockReturnThis(),
  serialize: jest.fn(),
}))
export const TxBuilder = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  addRecipient: jest.fn(),
  addUnspendable: jest.fn(),
  addUtxo: jest.fn(),
  addUtxos: jest.fn(),
  doNotSpendChange: jest.fn(),
  manuallySelectedOnly: jest.fn(),
  onlySpendChange: jest.fn(),
  unspendable: jest.fn(),
  feeRate: jest.fn(),
  feeAbsolute: jest.fn(),
  drainWallet: jest.fn(),
  drainTo: jest.fn(),
  enableRbf: jest.fn(),
  enableRbfWithSequence: jest.fn(),
  addData: jest.fn(),
  setRecipients: jest.fn(),
  finish: jest.fn(),
}))
export const Wallet = jest.fn().mockImplementation(() => ({
  create: jest.fn().mockReturnThis(),
  getAddress: jest.fn(),
  getBalance: jest.fn().mockResolvedValue({
    trustedPending: 0,
    untrustedPending: 0,
    confirmed: 0,
    spendable: 0,
    total: 0,
  }),
  network: jest.fn(),
  sync: jest.fn(),
  listUnspent: jest.fn().mockResolvedValue([]),
  listTransactions: jest.fn().mockResolvedValue([]),
  sign: jest.fn(),
}))
