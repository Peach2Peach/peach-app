import { render } from 'test-utils'
import { SellSummary } from './SellSummary'

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('SellSummary', () => {
  it('should render the SellSummary view', () => {
    expect(render(<SellSummary />)).toMatchSnapshot()
  })
})
