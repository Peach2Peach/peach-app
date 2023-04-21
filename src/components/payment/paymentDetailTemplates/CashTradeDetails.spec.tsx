import { CashTradeDetails } from './CashTradeDetails'
import { createRenderer } from 'react-test-renderer/shallow'
import { meetupEventsStore } from '../../../store/meetupEventsStore'

describe('CashTradeDetails', () => {
  const renderer = createRenderer()
  meetupEventsStore.setState({
    getMeetupEvent: (_id: string) => ({
      shortName: 'shortName',
      city: 'city',
      id: 'id',
      country: 'DE',
      longName: 'longName',
    }),
  })
  it('renders correctly', () => {
    renderer.render(<CashTradeDetails paymentMethod="cash.DE" disputeActive={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
