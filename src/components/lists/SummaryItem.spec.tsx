import { SummaryItem } from './SummaryItem'
import { createRenderer } from 'react-test-renderer/shallow'

describe('SummaryItem', () => {
  const renderer = createRenderer()

  const title = 'title'
  const amount = 100000
  const currency = 'EUR'
  const price = 100
  const date = new Date('2022-09-15T07:23:25.797Z')
  const action: Action = {
    callback: jest.fn(),
    label: 'action',
    icon: 'xCircle',
  }
  it('renders correctly for level DEFAULT', () => {
    renderer.render(<SummaryItem {...{ title, amount, currency, price, date, level: 'DEFAULT' }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for level DEFAULT with action', () => {
    renderer.render(<SummaryItem {...{ title, amount, currency, price, date, level: 'DEFAULT', action }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
