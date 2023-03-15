import { log } from './log'

describe('log', () => {
  const logSpy = jest.spyOn(console, 'log')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging log to console', () => {
    log('Test')
    expect(logSpy).toHaveBeenCalled()
  })
})
