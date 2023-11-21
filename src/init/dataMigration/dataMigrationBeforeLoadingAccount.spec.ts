import { dataMigrationBeforeLoadingAccount } from './dataMigrationBeforeLoadingAccount'

describe('dataMigrationBeforeLoadingAccount', () => {
  it('should do nothing at the moment', async () => {
    expect(await dataMigrationBeforeLoadingAccount()).toBeUndefined()
  })
})
