import { deepStrictEqual } from 'assert'
import { accountStorage } from '../../../../utils/account/accountStorage'
import { resetStorage } from '../../../../../tests/unit/prepare'
import { loadSettings } from './loadSettings'
import { settings1 } from '../../../../../tests/unit/data/settingsData'

describe('loadSettings', () => {
  afterEach(() => {
    resetStorage()
  })

  it('loads settings', async () => {
    accountStorage.setMap('settings', settings1)

    const settings = await loadSettings()
    expect(accountStorage.getMap).toHaveBeenCalledWith('settings')
    deepStrictEqual(settings, settings1)
  })
})
