import { deepStrictEqual, ok, strictEqual, notStrictEqual } from 'assert'
import Share from 'react-native-share'
import {
  account,
  backupAccount,
  createAccount,
  defaultAccount,
  deleteAccount,
  loadAccount,
  recoverAccount,
  saveAccount,
  setAccount,
  updatePaymentData,
  updateSettings
} from '../../src/utils/account'
import * as fileUtils from '../../src/utils/file'
import { getPeachAccount } from '../../src/utils/peachAPI'
import { getSession } from '../../src/utils/session'
import { getWallet } from '../../src/utils/wallet'
import * as accountData from '../data/accountData'

const password = 'supersecret'

jest.mock('react-native-fs', () => ({
  readFile: async (): Promise<string> => JSON.stringify(accountData.account1),
  writeFile: async (): Promise<void> => {},
  unlink: async (): Promise<void> => {}
}))

describe('setAccount', () => {
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
    await setAccount(defaultAccount)
  })

  it('returns already loaded account', async () => {
    await setAccount(accountData.account1)
    const acc = await loadAccount(password)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.account1)
  })
  it('loads account from file', async () => {
    const readFileSpy = jest.spyOn(fileUtils, 'readFile')

    const acc = await loadAccount(password)
    expect(readFileSpy).toHaveBeenCalled()
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.account1)
  })
})

describe('saveAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('returns already loaded account', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await saveAccount(accountData.account1, password)
    expect(writeFileSpy).toHaveBeenCalled()
  })
})

describe('updateSettings', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })

  it('updates account settings', () => {
    const newSettings = {
      skipTutorial: true,
      currencies: ['EUR', 'CHF'] as Currency[],
    }

    updateSettings(newSettings)
    deepStrictEqual(account.settings, newSettings)
  })

  it('updates account settings without overwriting untouched settings', () => {
    const newSettings = {
      currencies: ['EUR'] as Currency[],
    }

    updateSettings(newSettings)
    deepStrictEqual(account.settings, {
      skipTutorial: true,
      currencies: ['EUR'],
    })
  })
})

describe('updatePaymentData', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })

  it('add a new offer to account', () => {
    updatePaymentData(accountData.paymentData)
    deepStrictEqual(account.paymentData, accountData.paymentData)
  })
})

describe('backupAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })

  it('opens share dialog', async () => {
    const openSpy = jest.spyOn(Share, 'open')
    await backupAccount()
    expect(openSpy).toBeCalled()
  })
})

describe('recoverAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
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
  const onError = jest.fn()

  beforeAll(async () => {
    await setAccount(accountData.account1)
  })

  it('would delete account file', async () => {
    await deleteAccount({
      onSuccess,
      onError
    })
    expect(onSuccess).toBeCalled()
  })
})
