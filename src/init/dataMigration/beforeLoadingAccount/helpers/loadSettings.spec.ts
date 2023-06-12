import { deepStrictEqual } from 'assert'
import { accountStorage } from '../../../../utils/account/accountStorage'
import { loadSettings } from './loadSettings'
import { settings1 } from '../../../../../tests/unit/data/settingsData'
import { defaultSettings } from '../../../../store/defaults'

describe('loadSettings', () => {
  it('returns default settings if settings are not found', () => {
    const settings = loadSettings()
    expect(accountStorage.getMap).toHaveBeenCalledWith('settings')
    expect(settings).toEqual(defaultSettings)
  })
  it('loads settings', () => {
    accountStorage.setMap('settings', settings1)

    const settings = loadSettings()
    expect(accountStorage.getMap).toHaveBeenCalledWith('settings')
    deepStrictEqual(settings, settings1)
  })
})
