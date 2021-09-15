/**
 * @format
 */

import 'react-native'
import React from 'react'
import Select from '../../src/components/inputs/Select'
import { ok, strictEqual } from 'assert'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

jest.useFakeTimers()

describe('Select', () => {
  const items = [
    { value: 'peach', text: 'Peach' },
    { value: 'banana', text: 'Banana' },
    { value: 'apple', text: 'Apple' }
  ]
  it('renders a select with 3 items and first selected', () => {
    const tree = renderer.create(<Select
      items={items}
      selectedValue={'peach'}
    />).toJSON()

    strictEqual(tree.children[0].props.items[0].value, items[0].value)
    strictEqual(tree.children[0].props.items[1].value, items[1].value)
    strictEqual(tree.children[0].props.items[2].value, items[2].value)
    strictEqual(tree.children[0].props.items[0].label, items[0].text)
    strictEqual(tree.children[0].props.items[1].label, items[1].text)
    strictEqual(tree.children[0].props.items[2].label, items[2].text)
    ok(tree.children[0].props.selectedIndex === 0)
  })
  it('renders a select with 3 items and second selected', () => {
    const tree = renderer.create(<Select
      items={items}
      selectedValue={'banana'}
    />).toJSON()

    ok(tree.children[0].props.selectedIndex === 1)
  })
})