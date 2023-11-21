import { useWalletState } from '../utils/wallet/walletStore'
import { waitForHydration } from './waitForHydration'

describe('waitForHydration', () => {
  const hasHydratedSpy = jest.spyOn(useWalletState.persist, 'hasHydrated')
  const onFinishHydrationSpy = jest.spyOn(useWalletState.persist, 'onFinishHydration')
  it('should call immediately when hydrated', async () => {
    const result = await waitForHydration(useWalletState)
    expect(hasHydratedSpy).toHaveBeenCalled()
    expect(onFinishHydrationSpy).not.toHaveBeenCalled()
    expect(result).toBeTruthy()
  })
  it('should call after hydration has been finished', async () => {
    hasHydratedSpy.mockReturnValue(false)
    // @ts-expect-error won't bother to get the types right for a test
    onFinishHydrationSpy.mockImplementation((cb: () => void) => {
      cb()
    })
    const result = await waitForHydration(useWalletState)
    expect(hasHydratedSpy).toHaveBeenCalled()
    expect(onFinishHydrationSpy).toHaveBeenCalled()
    expect(result).toBeTruthy()
  })
})
