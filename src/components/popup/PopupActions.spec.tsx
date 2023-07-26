import { PopupActions } from './PopupActions'
import { render } from '@testing-library/react-native'
import { PopupAction } from './PopupAction'
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

describe('PopupActions', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <PopupActions>
        <PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" />
      </PopupActions>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when applying style', () => {
    const { toJSON } = render(
      <PopupActions style={{ backgroundColor: 'red' }}>
        <PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" />
      </PopupActions>,
    )
    expect(
      render(
        <PopupActions>
          <PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" />
        </PopupActions>,
      ).toJSON(),
    ).toMatchDiffSnapshot(toJSON())
  })
})
