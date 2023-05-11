import { Divider } from './Divider'
import { createRenderer } from 'react-test-renderer/shallow'
import Icon from './Icon'
import { mockDimensions } from '../../tests/unit/helpers/mockDimensions'

describe('Divider', () => {
  const renderer = createRenderer()
  const text = 'text'
  const icon = <Icon id="bitcoin" />
  beforeEach(() => {
    mockDimensions({ width: 375, height: 690 })
  })
  it('renders correctly', () => {
    renderer.render(<Divider text={text} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with icon', () => {
    renderer.render(<Divider text={text} icon={icon} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with iconAlign', () => {
    renderer.render(<Divider text={text} icon={icon} iconAlign="right" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with align', () => {
    renderer.render(<Divider text={text} align="center" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with type heavy', () => {
    renderer.render(<Divider text={text} type="heavy" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with type error', () => {
    renderer.render(<Divider text={text} type="error" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly on lg', () => {
    mockDimensions({ width: 376, height: 691 })
    renderer.render(<Divider text={text} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
