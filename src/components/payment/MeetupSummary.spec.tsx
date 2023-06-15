import { createRenderer } from 'react-test-renderer/shallow'
import { MeetupSummary } from './MeetupSummary'

describe('MeetupSummary', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<MeetupSummary event={{ city: 'city', longName: 'longName' }} onPress={() => {}} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
