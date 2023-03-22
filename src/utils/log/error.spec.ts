import { logMock } from '../../../tests/unit/prepare'
import { isProduction } from '../system'
import { error } from './error'

jest.mock('../system', () => ({
  isProduction: jest.fn(),
}))

describe('error', () => {
  const errorSpy = jest.spyOn(console, 'error')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging error to console for dev environment', () => {
    ;(isProduction as jest.Mock).mockReturnValueOnce(false)

    error('Test')
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR - Test'))
    expect(logMock).not.toHaveBeenCalled()
  })
  it('is logging error to crashlytics for prod environment', () => {
    ;(isProduction as jest.Mock).mockReturnValueOnce(true)
    error('Test')
    expect(logMock).toHaveBeenCalledWith(expect.stringContaining('ERROR - Test'))
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
