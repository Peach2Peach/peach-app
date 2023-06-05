import { account1 } from '../../../../tests/unit/data/accountData'
import { useAccountStore } from '../../../store/accountStore'
import { storeIdentity } from '../../../utils/account'
import { migrateAccountToStore } from './migrateAccountToStore'

describe('migrateAccountToStore', () => {
  beforeAll(async () => {
    await storeIdentity(account1)
  })
  afterEach(async () => {
    jest.clearAllMocks()
    useAccountStore.getState().reset()
  })
  it('should migrate account to store', async () => {
    await migrateAccountToStore()

    expect(useAccountStore.getState().migrated).toBe(true)
    expect(useAccountStore.getState().identity).toStrictEqual({
      mnemonic: account1.mnemonic,
      privKey: account1.privKey,
      publicKey: account1.publicKey,
      pgp: {
        privateKey: account1.pgp.privateKey,
        publicKey: account1.pgp.publicKey,
      },
    })
  })
  it('should not migrate account to store if already migrated', async () => {
    useAccountStore.setState({
      migrated: true,
    })
    await migrateAccountToStore()
    expect(useAccountStore.getState().identity).toEqual(undefined)
  })
})
