import React from 'react'
import { Text } from 'react-native'
import ShallowRenderer from 'react-test-renderer/shallow'
import { BuyingBitcoin } from './BuyingBitcoin'

// For some reason this is required to make the test suite run.
jest.mock('../../components', () => ({
  Text,
}))

describe('BuyingBitcoin', () => {
  it('renders correctly', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<BuyingBitcoin />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
  })
})
