import { configStore } from './configStore'

describe('configStore', () => {
  afterEach(() => {
    configStore.getState().reset()
  })
  it('dispute disclaimer seen state is false by default', () => {
    expect(configStore.getState().seenDisputeDisclaimer).toBeFalsy()
  })
  it('should set dispute disclaimer seen state', () => {
    configStore.getState().setSeenDisputeDisclaimer(true)
    expect(configStore.getState().seenDisputeDisclaimer).toBeTruthy()
  })
})
