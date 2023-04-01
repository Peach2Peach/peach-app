import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../../styles/tailwind'
import { InfoBlock } from './InfoBlock'

describe('InfoBlock', () => {
  const onInfoPressMock = jest.fn()

  it('should renders a default InfoBlock', () => {
    const renderer = createRenderer()
    renderer.render(<InfoBlock value="value" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should renders a full InfoBlock with style', () => {
    const renderer = createRenderer()
    renderer.render(<InfoBlock style={tw`mt-[2px]`} name="name" value="value" copyable onInfoPress={onInfoPressMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
