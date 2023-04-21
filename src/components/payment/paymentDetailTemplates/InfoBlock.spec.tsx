import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../../styles/tailwind'
import { InfoBlock } from './InfoBlock'

describe('InfoBlock', () => {
  const onInfoPressMock = jest.fn()

  const renderer = createRenderer()
  it('should render a default InfoBlock', () => {
    renderer.render(<InfoBlock value="value" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render a full InfoBlock with style', () => {
    renderer.render(<InfoBlock style={tw`mt-[2px]`} name="name" value="value" copyable onInfoPress={onInfoPressMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly with disputeActive', () => {
    renderer.render(
      <InfoBlock disputeActive style={tw`mt-[2px]`} name="name" value="value" copyable onInfoPress={onInfoPressMock} />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
