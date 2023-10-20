import { mockBDKRN } from './mocks/bdkRN'

jest.mock('../../src/utils/peachAPI', () => ({
  peachAPI: jest.requireActual('../../src/utils/peachAPI/peachAPI').peachAPI,
}))
jest.mock('../../peach-api/src/peachAPI')
jest.mock('../../src/utils/wallet/PeachWallet')
jest.mock('../../src/utils/log')

jest.mock('../../src/utils/system/getDeviceLocale', () => ({
  getDeviceLocale: () => 'en',
}))

mockBDKRN()
export {}
