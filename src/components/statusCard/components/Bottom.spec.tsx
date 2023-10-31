import { render } from 'test-utils'
import { Icon } from '../../Icon'
import { Bottom } from './Bottom'

describe('Bottom', () => {
  it("should not render anything if the label doesn't exist", () => {
    expect(
      render(<Bottom label={undefined} labelIcon={undefined} unreadMessages={undefined} color={'primary'} />),
    ).toMatchSnapshot()
  })
  it('should render correctly', () => {
    expect(
      render(<Bottom label="label" labelIcon={undefined} unreadMessages={undefined} color={'primary'} />),
    ).toMatchSnapshot()
  })
  it('should render correctly with labelIcon', () => {
    expect(
      render(
        <Bottom
          label="label"
          labelIcon={<Icon id="bitcoinLogo" size={10} />}
          unreadMessages={undefined}
          color={'primary'}
        />,
      ),
    ).toMatchSnapshot()
  })
  it('should render correctly with unreadMessages', () => {
    expect(
      render(<Bottom label="label" labelIcon={undefined} unreadMessages={10} color={'primary'} />),
    ).toMatchSnapshot()
  })
})
