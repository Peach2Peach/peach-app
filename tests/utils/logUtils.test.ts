import { info, log, trace, warn, error } from '../../src/utils/logUtils'

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

describe('trace', () => {
  const traceSpy = jest.spyOn(console, 'trace')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging trace to console', () => {
    trace('Test')
    expect(traceSpy).toHaveBeenCalled()
  })
})

describe('warn', () => {
  const warnSpy = jest.spyOn(console, 'warn')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging warn to console', () => {
    warn('Test')
    expect(warnSpy).toHaveBeenCalled()
  })
})


describe('error', () => {
  const errorSpy = jest.spyOn(console, 'error')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging error to console', () => {
    error('Test')
    expect(errorSpy).toHaveBeenCalled()
  })
})