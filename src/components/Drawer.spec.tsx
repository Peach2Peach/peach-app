import { Drawer } from './Drawer'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'

describe('Drawer', () => {
  const shallowRenderer = createRenderer()
  it('renders correctly', () => {
    shallowRenderer.render(
      <Drawer title={'testTitle'} content={<Text>Drawer content</Text>} show previousDrawer={{}} onClose={jest.fn()} />,
    )
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly with previous drawer', () => {
    shallowRenderer.render(
      <Drawer
        title={'testTitle'}
        content={<Text>Drawer content</Text>}
        show
        previousDrawer={{ title: 'previousTitle' }}
        onClose={jest.fn()}
      />,
    )
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
