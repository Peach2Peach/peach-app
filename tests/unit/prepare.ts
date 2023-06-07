import { mockBDKRN } from './mocks/bdkRN'

jest.mock('../../src/utils/peachAPI', () => ({
  ...jest.requireActual('../../src/utils/peachAPI'),
  ...jest.requireActual('../../src/utils/__mocks__/peachAPI'),
}))
jest.mock('../../src/utils/wallet/PeachWallet')
jest.mock('../../src/utils/log')

jest.mock('../../src/utils/system/getDeviceLocale', () => ({
  getDeviceLocale: () => 'en',
}))

mockBDKRN()
export {}
