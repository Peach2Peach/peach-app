import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { MatchInformation } from './MatchInformation'

describe('MatchInformation', () => {
  const shallowRenderer = createRenderer()
  const useWindowDimensionsSpy = jest.spyOn(jest.requireActual('react-native'), 'useWindowDimensions')

  it('renders correctly', () => {
    useWindowDimensionsSpy.mockReturnValueOnce({ width: 320, height: 620 })

    shallowRenderer.render(<MatchInformation offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly on medium screens', () => {
    useWindowDimensionsSpy.mockReturnValueOnce({ width: 376, height: 691 })

    shallowRenderer.render(<MatchInformation offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
