import { render } from 'test-utils'
import { Divider } from '../Divider'
import { NewDivider } from './NewDivider'

describe('NewDivider', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NewDivider title="title" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should be different from the existing Divider', () => {
    // once this test fails we can consolidate the two components
    expect(render(<NewDivider title="title" />)).not.toEqual(render(<Divider text="title" />))
  })
})
