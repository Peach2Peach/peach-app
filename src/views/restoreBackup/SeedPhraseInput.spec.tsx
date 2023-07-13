import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { SeedPhraseInput } from './SeedPhraseInput'

describe('SeedPhraseInput', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SeedPhraseInput index={0} setWords={jest.fn()} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
