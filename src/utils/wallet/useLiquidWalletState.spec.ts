import { useLiquidWalletState } from './useLiquidWalletState'

describe('useLiquidWalletState', () => {
  afterEach(() => {
    useLiquidWalletState.getState().reset()
  })
  it('returns defaults', () => {
    expect(useLiquidWalletState.getState()).toEqual({
      ...useLiquidWalletState.getState(),
      addresses: [],
      balance: 0,
      isSynced: false,
    })
  })

  it('sets isSynced', () => {
    expect(useLiquidWalletState.getState().isSynced).toBeFalsy()
    useLiquidWalletState.getState().setIsSynced(true)
    expect(useLiquidWalletState.getState().isSynced).toBeTruthy()
  })
  it("doesn't persist isSynced", () => {
    expect(useLiquidWalletState.persist.getOptions().partialize?.(useLiquidWalletState.getState())).not.toEqual(
      expect.objectContaining({ isSynced: expect.any(Boolean) }),
    )
  })
})
