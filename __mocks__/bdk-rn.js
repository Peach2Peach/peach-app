import { ok } from '@synonymdev/result'

export default {
  createDescriptor: jest.fn().mockResolvedValue(ok()),
  createWallet: jest.fn().mockResolvedValue(ok()),
  drainWallet: jest.fn().mockResolvedValue(ok()),
  generateMnemonic: jest.fn().mockResolvedValue(ok(0)),
  getBalance: jest.fn().mockResolvedValue(ok(0)),
  getNewAddress: jest.fn().mockResolvedValue(ok('address')),
  getTransactions: jest.fn().mockResolvedValue(ok({confirmed: [], pending: []})),
  syncWallet: jest.fn().mockResolvedValue(ok()),
}