import { info } from './info'

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
