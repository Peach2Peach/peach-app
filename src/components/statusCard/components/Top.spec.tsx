import { render } from 'test-utils'
import { StatusCardProps } from '../StatusCard'
import { Top } from './Top'

jest.mock('./Left', () => ({
  Left: 'Left',
}))

jest.mock('./Right', () => ({
  Right: 'Right',
}))

const props: StatusCardProps = {
  title: 'title',
  subtext: 'subtext',
  icon: undefined,
  replaced: true,
  amount: 21,
  price: 100000,
  currency: 'EUR',
  onPress: jest.fn(),
  color: 'primary',
}
describe('Top', () => {
  it('should render correctly', () => {
    expect(render(<Top {...props} />)).toMatchSnapshot()
  })
})
