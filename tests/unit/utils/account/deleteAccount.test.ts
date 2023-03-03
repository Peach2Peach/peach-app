import { ok } from 'assert'
import { settingsStorage } from '../../../../src/store/settingsStore'
import { deleteAccount, setAccount } from '../../../../src/utils/account'
import { accountStorage } from '../../../../src/utils/account/accountStorage'
import { chatStorage } from '../../../../src/utils/account/chatStorage'
import { contractStorage } from '../../../../src/utils/account/contractStorage'
import { offerStorage } from '../../../../src/utils/account/offerStorage'
import { logoutUser } from '../../../../src/utils/peachAPI'
import { deleteAccessToken } from '../../../../src/utils/peachAPI/accessToken'
import { deletePeachAccount } from '../../../../src/utils/peachAPI/peachAccount'
import { sessionStorage } from '../../../../src/utils/session'
import * as accountData from '../../data/accountData'
import { resetStorage } from '../../prepare'

jest.mock('../../../../src/utils/peachAPI/accessToken', () => ({
  ...jest.requireActual('../../../../src/utils/peachAPI/accessToken'),
  deleteAccessToken: jest.fn(),
}))
jest.mock('../../../../src/utils/peachAPI/peachAccount', () => ({
  ...jest.requireActual('../../../../src/utils/peachAPI/peachAccount'),
  deletePeachAccount: jest.fn(),
}))
jest.mock('../../../../src/store/settingsStore', () => ({
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

jest.mock('../../../../src/components/footer/notificationsStore', () => ({
  notificationStorage: {
    clearStore: jest.fn(),
  },
  notificationStore: {
    getState: () => ({
      reset: jest.fn(),
    }),
  },
}))
jest.mock('../../../../src/store/configStore', () => ({
  configStorage: {
    clearStore: jest.fn(),
  },
  configStore: {
    getState: () => ({
      reset: jest.fn(),
    }),
  },
}))
jest.mock('../../../../src/utils/wallet/walletStore', () => ({
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
    expect(logoutUser).toHaveBeenCalled()
    expect(deleteAccessToken).toHaveBeenCalled()
    expect(deletePeachAccount).toHaveBeenCalled()

    ok(true)
  })
})
