import { info } from '../../../../src/utils/log'

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
