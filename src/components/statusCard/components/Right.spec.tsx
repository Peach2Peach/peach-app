import { render } from 'test-utils'
import { Right } from './Right'

describe('Right', () => {
  it('should render correctly with amount', () => {
    expect(render(<Right amount={21} />)).toMatchSnapshot()
  })
  it('should render correctly with fiatAmount', () => {
    expect(render(<Right amount={21} price={100000} currency="EUR" />)).toMatchSnapshot()
  })
  it('should render correctly with range', () => {
    expect(render(<Right amount={[21, 21000]} />)).toMatchSnapshot()
  })
  it('should render correctly when empty', () => {
    expect(render(<Right />)).toMatchSnapshot()
  })
})
