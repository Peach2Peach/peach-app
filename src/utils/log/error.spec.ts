import crashlytics from '@react-native-firebase/crashlytics'
import { Alert } from 'react-native'
import { isProduction } from '../system'
import { error } from './error'

jest.mock('../system/isProduction', () => ({
  isProduction: jest.fn(),
}))

describe('error', () => {
  const errorSpy = jest.spyOn(console, 'error')

  it('is logging error to console for dev environment', () => {
    (isProduction as jest.Mock).mockReturnValueOnce(false)
    const alertSpy = jest.spyOn(Alert, 'alert')

    error('Test')
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR - Test'))
    expect(crashlytics().log).not.toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalled()
  })
  it('is logging error to crashlytics for prod environment', () => {
    (isProduction as jest.Mock).mockReturnValueOnce(true)
    error('Test')
    expect(crashlytics().log).toHaveBeenCalledWith(expect.stringContaining('ERROR - Test'))
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
