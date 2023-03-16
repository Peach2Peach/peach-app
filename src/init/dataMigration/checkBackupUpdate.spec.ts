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

    // Act
    checkBackupUpdate()

    // Assert
    expect(setLastFileBackupDateSpy).not.toHaveBeenCalled()
  })

  test('sets lastFileBackupDate to lastBackupDate if lastBackupDate is defined', () => {
    const lastBackup = 1678887045258
    settingsStore.setState({
      // @ts-expect-error
      lastBackupDate: lastBackup,
    })
    // Arrange
    const setLastFileBackupDateSpy = jest.spyOn(settingsStore.getState(), 'setLastFileBackupDate')

    // Act
    checkBackupUpdate()

    // Assert
    expect(setLastFileBackupDateSpy).toHaveBeenCalledWith(lastBackup)
  })
})
