import { ok } from 'assert'
import { settingsStorage } from '../../store/settingsStore'
import { deleteAccount, setAccount } from '.'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { contractStorage } from './contractStorage'
import { offerStorage } from './offerStorage'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import * as accountData from '../../../tests/unit/data/accountData'
import { resetStorage } from '../../../tests/unit/prepare'

jest.mock('../peachAPI/accessToken', () => ({
  ...jest.requireActual('../peachAPI/accessToken'),
  deleteAccessToken: jest.fn(),
}))
jest.mock('../peachAPI/peachAccount', () => ({
  ...jest.requireActual('../peachAPI/peachAccount'),
  deletePeachAccount: jest.fn(),
}))
jest.mock('../../store/settingsStore', () => ({
  settingsStorage: {
    clearStore: jest.fn(),
  },
  settingsStore: {
    getState: () => ({
      reset: jest.fn(),
      updateSettings: jest.fn(),
    }),
  },
}))

jest.mock('../../components/footer/notificationsStore', () => ({
  notificationStorage: {
    clearStore: jest.fn(),
  },
  notificationStore: {
    getState: () => ({
      reset: jest.fn(),
    }),
  },
}))
jest.mock('../../store/configStore', () => ({
  configStorage: {
    clearStore: jest.fn(),
  },
  configStore: {
    getState: () => ({
      reset: jest.fn(),
    }),
  },
}))
jest.mock('../wallet/walletStore', () => ({
  walletStorage: {
    clearStore: jest.fn(),
  },
  walletStore: {
    getState: () => ({
      reset: jest.fn(),
    }),
  },
}))

describe('deleteAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('would delete account file', async () => {
    await deleteAccount()

    expect(accountStorage.clearStore).toHaveBeenCalled()
    expect(offerStorage.clearStore).toHaveBeenCalled()
    expect(contractStorage.clearStore).toHaveBeenCalled()
    expect(chatStorage.clearStore).toHaveBeenCalled()
    expect(sessionStorage.clearStore).toHaveBeenCalled()
    expect(settingsStorage.clearStore).toHaveBeenCalled()
    expect(deleteAccessToken).toHaveBeenCalled()
    expect(deletePeachAccount).toHaveBeenCalled()

    ok(true)
  })
})
