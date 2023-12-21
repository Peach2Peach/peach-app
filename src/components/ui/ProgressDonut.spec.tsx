import { createRenderer } from 'react-test-renderer/shallow'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import { ProgressDonut } from './ProgressDonut'

const isIOSMock = jest.fn()
jest.mock('../../utils/system/isIOS', () => ({
  isIOS: () => isIOSMock(),
}))

describe('ProgressDonut', () => {
  const shallowRenderer = createRenderer()
  beforeEach(() => {
    mockDimensions({ width: 374, height: 689 })
  })
  it('should render correctly', () => {
    shallowRenderer.render(<ProgressDonut title="Donut Test" value={1} max={5} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when empty', () => {
    shallowRenderer.render(<ProgressDonut title="Donut Test" value={0} max={5} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when full', () => {
    shallowRenderer.render(<ProgressDonut title="Donut Test" value={5} max={5} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for iOS', () => {
    isIOSMock.mockReturnValueOnce(true)
    shallowRenderer.render(<ProgressDonut title="Donut Test" value={1} max={5} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium viewports', () => {
    mockDimensions({ width: 375, height: 690 })

    isIOSMock.mockReturnValueOnce(true)
    shallowRenderer.render(<ProgressDonut title="Donut Test" value={1} max={5} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
