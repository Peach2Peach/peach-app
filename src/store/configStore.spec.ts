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
  it('dispute hasSeenGroupHugAnnouncement seen state is false by default', () => {
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeFalsy()
  })
  it('should set dispute hasSeenGroupHugAnnouncement state', () => {
    useConfigStore.getState().setHasSeenGroupHugAnnouncement(true)
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeTruthy()
  })
})
