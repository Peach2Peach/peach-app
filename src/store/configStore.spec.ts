import { useConfigStore } from './configStore'

describe('configStore', () => {
  afterEach(() => {
    useConfigStore.getState().reset()
  })
  it('dispute disclaimer seen state is false by default', () => {
    expect(useConfigStore.getState().seenDisputeDisclaimer).toBeFalsy()
  })
  it('should set dispute disclaimer seen state', () => {
    useConfigStore.getState().setSeenDisputeDisclaimer(true)
    expect(useConfigStore.getState().seenDisputeDisclaimer).toBeTruthy()
  })
})
