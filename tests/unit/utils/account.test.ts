/* eslint-disable max-lines */
import { deepStrictEqual, ok, strictEqual, notStrictEqual } from 'assert'
import Share from 'react-native-share'
import { APPVERSION } from '../../../src/constants'
import {
  account,
  addPaymentData,
  backupAccount,
  createAccount,
  defaultAccount,
  deleteAccount,
  loadAccount,
  recoverAccount,
  setAccount,
  updatePaymentData,
  updateSettings
} from '../../../src/utils/account'
import { storeAccount } from '../../../src/utils/account/'
import {
  storeChats,
  storeContracts,
  storeIdentity,
  storeOffers,
  storePaymentData,
  storeSettings,
  storeTradingLimit
} from '../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../src/utils/file'
import { getPeachAccount } from '../../../src/utils/peachAPI'
import { getSession } from '../../../src/utils/session'
import { getWallet } from '../../../src/utils/wallet'
import * as accountData from '../data/accountData'

const password = 'supersecret'

let fakeFiles: Record<string, string> = {}
jest.mock('react-native-fs', () => ({
  exists: async (path: string): Promise<boolean> => !!fakeFiles[path],
  readFile: async (path: string): Promise<string> => fakeFiles[path],
  writeFile: async (path: string, data: string): Promise<void> => {
    fakeFiles[path] = data
  },
  unlink: async (path: string): Promise<void> => {
    delete fakeFiles[path]
  }
}))

describe('setAccount', () => {
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('sets an account, sets wallet and peachAccount', async () => {
    await setAccount(accountData.account1, true)
    deepStrictEqual(account, accountData.account1)
    ok(getWallet())
    ok(getPeachAccount())
  })
})

describe('createAccount', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()

  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('creates a new account each time', async () => {
    await createAccount({
      password,
      onSuccess,
      onError
    })
    const firstPublicKey = JSON.parse(JSON.stringify(account.publicKey))

    ok(account.publicKey)
    ok(account.privKey)
    ok(account.mnemonic)
    strictEqual(getSession().password, password)
    expect(onSuccess).toHaveBeenCalled()

    await createAccount({
      password,
      onSuccess,
      onError
    })

    notStrictEqual(firstPublicKey, account.publicKey)
  })
})

describe('loadAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('returns already loaded account', async () => {
    await setAccount(accountData.account1)
    const acc = await loadAccount(password)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.account1)
  })
  it('loads account from file', async () => {
    const existsSpy = jest.spyOn(fileUtils, 'exists')
    const readFileSpy = jest.spyOn(fileUtils, 'readFile')

    await storeAccount(accountData.account1, password)

    const acc = await loadAccount(password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-identity.json')
    expect(readFileSpy).toHaveBeenCalledTimes(7)
    expect(readFileSpy).toHaveBeenCalledWith(
      expect.stringContaining('.json'),
      password,
    )
    ok(acc.publicKey)
    ok(account.publicKey)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.account1)
  })
})

describe('storeAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to whole account', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeAccount(accountData.account1, password)
    expect(writeFileSpy).toHaveBeenCalledTimes(7)
    expect(writeFileSpy).toHaveBeenCalledWith(
      expect.stringContaining('.json'),
      expect.stringContaining('{'),
      password,
    )
  })
})

describe('storeIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store identity', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeIdentity(accountData.account1, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-identity.json',
      JSON.stringify({
        publicKey: accountData.account1.publicKey,
        privKey: accountData.account1.privKey,
        mnemonic: accountData.account1.mnemonic,
        pgp: accountData.account1.pgp,
      }),
      password
    )
  })
})

describe('storeSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeSettings(defaultAccount.settings, password)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store settings', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeSettings(accountData.account1.settings, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-settings.json',
      JSON.stringify(accountData.account1.settings),
      password
    )
  })
})

describe('storeTradingLimit', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeTradingLimit(defaultAccount.tradingLimit, password)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store tradingLimit', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeTradingLimit(accountData.account1.tradingLimit, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-tradingLimit.json',
      JSON.stringify(accountData.account1.tradingLimit),
      password
    )
  })
})

describe('storePaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storePaymentData(defaultAccount.paymentData, password)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store paymentData', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storePaymentData(accountData.account1.paymentData, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-paymentData.json',
      JSON.stringify(accountData.account1.paymentData),
      password
    )
  })
})

describe('storeOffers', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeOffers(defaultAccount.offers, password)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store offers', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeOffers(accountData.account1.offers, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-offers.json',
      JSON.stringify(accountData.account1.offers),
      password
    )
  })
})

describe('storeContracts', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeContracts(defaultAccount.contracts, password)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store contracts', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeContracts(accountData.account1.contracts, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-contracts.json',
      JSON.stringify(accountData.account1.contracts),
      password
    )
  })
})

describe('storeChats', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeChats(defaultAccount.chats, password)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would write file to store chats', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeChats(accountData.account1.chats, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-chats.json',
      JSON.stringify(accountData.account1.chats),
      password
    )
  })
})

describe('updateSettings', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('updates account settings', () => {
    const meansOfPayment: MeansOfPayment = {
      EUR: ['sepa'],
      CHF: ['sepa', 'twint'],
    }
    const newSettings = {
      meansOfPayment,
    }

    updateSettings(newSettings)
    deepStrictEqual(account.settings, {
      ...account.settings,
      ...newSettings
    })
  })

  it('updates account settings without overwriting untouched settings', () => {
    const meansOfPayment: MeansOfPayment = {
      EUR: ['sepa', 'paypal']
    }

    updateSettings({ meansOfPayment })
    deepStrictEqual(account.settings, {
      appVersion: APPVERSION,
      displayCurrency: 'EUR',
      locale: 'en',
      meansOfPayment: {
        'EUR': ['sepa', 'paypal']
      },
      preferredCurrencies: [],
      preferredPaymentMethods: {},
      showBackupReminder: true,
    })
  })
})

describe('addPaymentData', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('adds new payment data to account', () => {
    addPaymentData(accountData.paymentData[0])
    addPaymentData(accountData.paymentData[1])
    deepStrictEqual(account.paymentData, accountData.paymentData)
  })
  it('updates payment data on account', () => {
    addPaymentData({
      ...accountData.paymentData[1],
      beneficiary: 'Hal'
    })
    deepStrictEqual(account.paymentData[1].beneficiary, 'Hal')
  })
})

describe('updatePaymentData', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('updates account payment data', () => {
    updatePaymentData(accountData.paymentData)
    deepStrictEqual(account.paymentData, accountData.paymentData)
  })
})

describe('backupAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('opens share dialog', async () => {
    const openSpy = jest.spyOn(Share, 'open')
    await backupAccount({ onSuccess: () => {}, onError: () => {} })
    expect(openSpy).toBeCalled()
  })
})

describe('recoverAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would decrypt recovery account', async () => {
    const [recoveredAccount, err] = await recoverAccount({
      encryptedAccount: JSON.stringify(accountData.recoveredAccount),
      password: 'mockpassword',
    })
    ok(!err, 'Error has been thrown ' + err)
    deepStrictEqual(recoveredAccount, accountData.recoveredAccount)
  })
})

describe('deleteAccount', () => {
  const onSuccess = jest.fn()

  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    fakeFiles = {}
    jest.clearAllMocks()
  })

  it('would delete account file', async () => {
    await deleteAccount({ onSuccess })
    expect(onSuccess).toBeCalled()
  })
})
