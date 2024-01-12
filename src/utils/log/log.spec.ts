import crashlytics from '@react-native-firebase/crashlytics'
import { isProduction } from '../system/isProduction'

jest.mock('../system/isProduction', () => ({
  isProduction: jest.fn(),
}))

describe('log', () => {
  const log = jest.requireActual('./log').log
  const consoleSpy = jest.spyOn(console, 'log')

  it('is logging log to console for dev environment', () => {
    (isProduction as jest.Mock).mockReturnValueOnce(false)

    log('Test')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('LOG - Test'))
    expect(crashlytics().log).not.toHaveBeenCalled()
  })
  it('is logging log to crashlytics for prod environment', () => {
    (isProduction as jest.Mock).mockReturnValueOnce(true)
    log('Test')
    expect(crashlytics().log).toHaveBeenCalledWith(expect.stringContaining('LOG - Test'))
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})
