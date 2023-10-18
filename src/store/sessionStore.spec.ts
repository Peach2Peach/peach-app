import { useSessionStore } from './sessionStore'

describe('sessionStore', () => {
  it('should return defaults', () => {
    expect(useSessionStore.getState()).toEqual({
      ...useSessionStore.getState(),
      walletSynced: false,
    })
  })
  it('should set wallet synced', () => {
    useSessionStore.getState().setWalletSynced(true)
    expect(useSessionStore.getState().walletSynced).toBeTruthy()
  })
})
