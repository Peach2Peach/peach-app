import { render } from 'test-utils'
import { Rate } from './Rate'

describe('Rate', () => {
  it('should render correctly', () => {
    const contract = {} as Contract
    const view = 'buyer'
    const saveAndUpdate = jest.fn()
    const vote = 'positive'

    const { toJSON } = render(<Rate {...{ contract, view, vote, saveAndUpdate }} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
