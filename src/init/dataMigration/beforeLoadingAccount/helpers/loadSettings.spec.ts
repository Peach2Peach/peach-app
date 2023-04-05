import { deepStrictEqual } from 'assert'
import { accountStorage } from '../../../../utils/account/accountStorage'
import { resetStorage } from '../../../../../tests/unit/prepare'
import { loadSettings } from './loadSettings'
import { settings1 } from '../../../../../tests/unit/data/settingsData'
import { defaultSettings } from '../../../../store/defaults'

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

  it('returns default settings if settings are not found', async () => {
    const settings = await loadSettings()
    expect(accountStorage.getMap).toHaveBeenCalledWith('settings')
    expect(settings).toEqual(defaultSettings)
  })
})
