import crashlytics from '@react-native-firebase/crashlytics'
import { isProduction } from '../system/isProduction'
import { error } from './error'

jest.mock('../system/isProduction', () => ({
  isProduction: jest.fn(),
}))

describe('error', () => {
  const errorSpy = jest.spyOn(console, 'error')

  it('is logging error to console for dev environment', () => {
    (isProduction as jest.Mock).mockReturnValueOnce(false)

    error('Test')
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR - Test'))
    expect(crashlytics().log).not.toHaveBeenCalled()
  })
  it('is logging error to crashlytics for prod environment', () => {
    (isProduction as jest.Mock).mockReturnValueOnce(true)
    error('Test')
    expect(crashlytics().log).toHaveBeenCalledWith(expect.stringContaining('ERROR - Test'))
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
