import { isRejectedPromise } from './isRejectedPromise'

describe('isRejectedPromise', () => {
  const rejected = () => new Promise((resolve, reject) => reject(new Error('0')))
  const resolved = () => new Promise((resolve) => resolve(1))

  it('checks whether an a promise is rejected', async () => {
    const [rejectedResult] = await Promise.allSettled([rejected()])
    expect(isRejectedPromise(rejectedResult)).toBe(true)
  })
  it('checks whether an error is not a network error', async () => {
    const [resolvedResult] = await Promise.allSettled([resolved()])

    expect(isRejectedPromise(resolvedResult)).toBe(false)
  })
})
