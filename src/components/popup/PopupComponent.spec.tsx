import { Text } from 'react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import tw from '../../styles/tailwind'
import { PopupAction } from './PopupAction'
import { PopupComponent } from './PopupComponent'
expect.extend({ toMatchDiffSnapshot })

describe('PopupComponent', () => {
  const defaultComponent = (
    <PopupComponent
      content={<Text>content</Text>}
      actions={<PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" style={tw`items-center`} />}
    />
  )
  it('renders correctly', () => {
    const { toJSON } = render(defaultComponent)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with title', () => {
    const { toJSON } = render(
      <PopupComponent
        title="title"
        content={<Text>content</Text>}
        actions={<PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" style={tw`items-center`} />}
      />,
    )
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('renders correctly with different background colors', () => {
    const { toJSON } = render(
      <PopupComponent
        bgColor={{ backgroundColor: 'red' }}
        actionBgColor={{ backgroundColor: 'blue' }}
        content={<Text>content</Text>}
        actions={<PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" style={tw`items-center`} />}
      />,
    )
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
