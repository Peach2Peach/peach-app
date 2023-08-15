import { createRenderer } from 'react-test-renderer/shallow'
import { GroupHugAnnouncement } from './GroupHugAnnouncement'

const useGroupHugAnnouncementSetupMock = jest.fn().mockReturnValue({
  goToSettings: jest.fn(),
  close: jest.fn(),
})
jest.mock('./hooks/useGroupHugAnnouncementSetup', () => ({
  useGroupHugAnnouncementSetup: () => useGroupHugAnnouncementSetupMock(),
}))

describe('GroupHugAnnouncement', () => {
  const shallowRenderer = createRenderer()

  it('renders correctly', () => {
    shallowRenderer.render(<GroupHugAnnouncement />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
