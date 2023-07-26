import { PopupActions } from './PopupActions'
import { render } from '@testing-library/react-native'
import { PopupAction } from './PopupAction'
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

describe('PopupActions', () => {
  const defaultActions = (
    <PopupActions>
      <PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" />
    </PopupActions>
  )
  it('renders correctly', () => {
    const { toJSON } = render(defaultActions)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when applying style', () => {
    const { toJSON } = render(
      <PopupActions style={{ backgroundColor: 'red' }}>
        <PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" />
      </PopupActions>,
    )
    expect(render(defaultActions).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
