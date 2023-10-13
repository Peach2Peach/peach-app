import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import { TouchableIcon } from './TouchableIcon'
expect.extend({ toMatchDiffSnapshot })

describe('TouchableIcon', () => {
  const defaultIcon = <TouchableIcon id="chevronLeft" />
  it('should render correctly', () => {
    const { toJSON } = render(defaultIcon)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly with a custom icon color and size', () => {
    const { toJSON } = render(<TouchableIcon id="chevronLeft" iconColor="#000" iconSize={32} />)

    expect(render(defaultIcon).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
