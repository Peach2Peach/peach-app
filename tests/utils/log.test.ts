import { info, log, error } from '../../src/utils/log'

describe('info', () => {
  const infoSpy = jest.spyOn(console, 'info')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging info to console', () => {
    info('Test')
    expect(infoSpy).toHaveBeenCalled()
  })
})

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

describe('error', () => {
  const errorSpy = jest.spyOn(console, 'log')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging error to console', () => {
    error('Test')
    expect(errorSpy).toHaveBeenCalled()
  })
})