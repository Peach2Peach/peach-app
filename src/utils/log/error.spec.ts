import { error } from './error'

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
