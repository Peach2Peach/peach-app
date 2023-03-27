import { logMock } from '../../../tests/unit/prepare'
import { isProduction } from '../system'
import { info } from './info'

jest.mock('../system', () => ({
  isProduction: jest.fn(),
}))

describe('info', () => {
  const infoSpy = jest.spyOn(console, 'info')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging info to console for dev environment', () => {
    ;(isProduction as jest.Mock).mockReturnValueOnce(false)

    info('Test')
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('INFO - Test'))
    expect(logMock).not.toHaveBeenCalled()
  })
  it('is logging info to crashlytics for prod environment', () => {
    ;(isProduction as jest.Mock).mockReturnValueOnce(true)
    info('Test')
    expect(logMock).toHaveBeenCalledWith(expect.stringContaining('INFO - Test'))
    expect(infoSpy).not.toHaveBeenCalled()
  })
})
