import { createRenderer } from 'react-test-renderer/shallow'
import { BonusPointsBar } from './BonusPointsBar'

describe('BonusPointsBar', () => {
  const shallowRenderer = createRenderer()
  it('should render component correctly', () => {
    shallowRenderer.render(<BonusPointsBar balance={20}/>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
