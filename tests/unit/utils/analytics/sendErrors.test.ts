import { sendErrors } from '../../../../src/utils/analytics'
import { appendFile } from '../../../../src/utils/file'
import { isAirplaneModeSyncMock, recordErrorMock } from '../../prepare'

jest.mock('../../../../src/utils/file', () => ({
  appendFile: jest.fn(),
}))

describe('sendErrors function', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should append the error messages to a file when airplane mode is enabled', async () => {
    isAirplaneModeSyncMock.mockReturnValue(true)
    const errors = [new Error('error 1'), new Error('error 2')]

    await sendErrors(errors)

    expect(appendFile as jest.Mock).toHaveBeenCalledWith('/error.log', 'error 1\nerror 2', true)
    expect(recordErrorMock.mock.calls.length).toBe(0)
  })

  it('should send crash reports to Crashlytics when airplane mode is not enabled', async () => {
    isAirplaneModeSyncMock.mockReturnValue(false)
    const errors = [new Error('error 1'), new Error('error 2')]

    await sendErrors(errors)

    expect((appendFile as jest.Mock).mock.calls.length).toBe(0)
    expect(recordErrorMock.mock.calls.length).toBe(2)
    expect(recordErrorMock.mock.calls[0][0]).toBe(errors[0])
    expect(recordErrorMock.mock.calls[1][0]).toBe(errors[1])
  })
})
