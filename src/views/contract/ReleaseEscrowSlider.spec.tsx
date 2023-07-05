import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

jest.mock('../../components/inputs/confirmSlider/ConfirmSlider', () => ({
  ConfirmSlider: 'ConfirmSlider',
}))

describe('ReleaseEscrowSlider', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ReleaseEscrowSlider contract={{} as Contract} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
