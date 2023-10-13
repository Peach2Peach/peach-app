import { render } from 'test-utils'
import tw from '../styles/tailwind'
import { Icon } from './Icon'

describe('Icon', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Icon id="helpCircle" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('can handle color', () => {
    const { toJSON } = render(<Icon id="helpCircle" color="#BADA55" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('can handle styles', () => {
    expect(render(<Icon id="helpCircle" style={tw`w-10 h-10`} />).toJSON()).toMatchSnapshot()
    expect(render(<Icon id="helpCircle" style={[tw`w-10`, tw`h-10`]} />).toJSON()).toMatchSnapshot()
  })
  it('can handle size', () => {
    expect(render(<Icon id="helpCircle" size={10} />).toJSON()).toMatchSnapshot()
  })
  it('renders ❌ if icon id is unknown', () => {
    // @ts-expect-error testing invalid icon id
    const { toJSON } = render(<Icon id="garble" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
