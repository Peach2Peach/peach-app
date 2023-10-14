import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import { PopupAction } from './PopupAction'
import { PopupActions } from './PopupActions'
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
