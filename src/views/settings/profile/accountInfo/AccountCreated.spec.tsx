import ShallowRenderer from 'react-test-renderer/shallow'
import { AccountCreated } from './AccountCreated'

describe('AccountCreated', () => {
  const renderer = ShallowRenderer.createRenderer()
  const creationDate = new Date('2022-09-14T16:14:02.835Z')
  it('should render correctly', () => {
    renderer.render(<AccountCreated {...{ creationDate }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
