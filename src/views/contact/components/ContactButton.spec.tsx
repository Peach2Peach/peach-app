import { create } from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'
import { OptionButton } from '../../../components'
import { ContactButton } from './ContactButton'

describe('ContactButton', () => {
  const renderer = ShallowRenderer.createRenderer()
  const reason = 'bug'
  const setReason = jest.fn()

  it('should render correctly', () => {
    renderer.render(<ContactButton {...{ reason, setReason }} />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })

  it('should call setReason on press', () => {
    const testInstance = create(<ContactButton {...{ reason, setReason }} />).root
    testInstance.findByType(OptionButton).props.onPress()
    expect(setReason).toHaveBeenCalledWith(reason)
  })
})
