import { render } from 'test-utils'
import { SeedPhraseInput } from './SeedPhraseInput'

describe('SeedPhraseInput', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SeedPhraseInput index={0} setWords={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
