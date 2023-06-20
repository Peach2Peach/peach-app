import { Top } from './Top'
import { render } from '@testing-library/react-native'
import { StatusCardProps } from '../StatusCard'

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
  color: 'orange',
}
describe('Top', () => {
  it('should render correctly', () => {
    expect(render(<Top {...props} />)).toMatchSnapshot()
  })
})
