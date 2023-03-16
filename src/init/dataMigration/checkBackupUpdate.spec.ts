import { settingsStore } from '../../store/settingsStore'
import { checkBackupUpdate } from './checkBackupUpdate'

describe('checkBackupUpdate function', () => {
  beforeEach(() => {
    settingsStore.setState({
      // @ts-expect-error
      lastBackupDate: undefined,
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('does nothing if lastBackupDate is undefined', () => {
    const setLastFileBackupDateSpy = jest.spyOn(settingsStore.getState(), 'setLastFileBackupDate')

    checkBackupUpdate()

    expect(setLastFileBackupDateSpy).not.toHaveBeenCalled()
  })

  test('sets lastFileBackupDate to lastBackupDate if lastBackupDate is defined', () => {
    const lastBackup = 1678887045258
    settingsStore.setState({
      // @ts-expect-error
      lastBackupDate: lastBackup,
    })
    const setLastFileBackupDateSpy = jest.spyOn(settingsStore.getState(), 'setLastFileBackupDate')

    checkBackupUpdate()

    expect(setLastFileBackupDateSpy).toHaveBeenCalledWith(lastBackup)
  })
})
