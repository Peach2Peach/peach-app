import { PopupActions } from './PopupActions'
import { render } from '@testing-library/react-native'
import { PopupAction } from './PopupAction'

describe('PopupActions', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <PopupActions>
        <PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" />
      </PopupActions>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
