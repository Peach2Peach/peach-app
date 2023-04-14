import { createRenderer } from 'react-test-renderer/shallow'
import { FooterItem } from './FooterItem'

describe('FooterItem', () => {
  const onPressMock = jest.fn()
  it('should render an active item', () => {
    const renderer = createRenderer()

    renderer.render(<FooterItem id="buy" active={true} onPress={onPressMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render an active item with inverted theme', () => {
    const renderer = createRenderer()

    renderer.render(<FooterItem id="buy" active={true} onPress={onPressMock} theme="inverted" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render an inactive item', () => {
    const renderer = createRenderer()

    renderer.render(<FooterItem id="sell" active={false} onPress={onPressMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render an inactive item with inverted theme', () => {
    const renderer = createRenderer()

    renderer.render(<FooterItem id="sell" active={false} onPress={onPressMock} theme="inverted" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render an item with notifications', () => {
    const renderer = createRenderer()

    renderer.render(<FooterItem id="yourTrades" active={false} onPress={onPressMock} notifications={4} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render an item without notifications with inverted theme', () => {
    const renderer = createRenderer()

    renderer.render(
      <FooterItem id="yourTrades" active={false} onPress={onPressMock} notifications={4} theme="inverted" />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render special item for settings', () => {
    const renderer = createRenderer()

    renderer.render(<FooterItem id="settings" active={true} onPress={onPressMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
    renderer.render(<FooterItem id="settings" active={false} onPress={onPressMock} />)
    const result2 = renderer.getRenderOutput()
    expect(result2).toMatchSnapshot()
  })
})
