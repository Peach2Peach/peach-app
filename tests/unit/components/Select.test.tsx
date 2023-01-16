/**
 * @format
 */

import { Pressable } from 'react-native'
import React from 'react'
import Select, { Item } from '../../../src/components/inputs/Select'
import { strictEqual } from 'assert'

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer'

jest.useFakeTimers()

describe('Select', () => {
  const items: Item[] = [
    { value: 'peach', display: 'Peach' },
    { value: 'banana', display: 'Banana' },
    { value: 'apple', display: 'Apple' },
  ]
  it('renders a select with 3 items and which are selectable', () => {
    let selectedValue = 'peach'
    const select = renderer.create(
      <Select items={items} selectedValue={selectedValue} onChange={(val) => (selectedValue = val as string)} />,
    )

    act(() => {
      select.root.findByType(Pressable).props.onPress()
    })

    const itemNodes = select.root.findAllByType(Pressable) as any[]
    strictEqual(itemNodes[1]._fiber.key, items[0].value)
    strictEqual(itemNodes[2]._fiber.key, items[1].value)
    strictEqual(itemNodes[3]._fiber.key, items[2].value)

    act(() => {
      select.root.findAllByType(Pressable)[2].props.onPress()
    })
    strictEqual(selectedValue, 'banana')
  })
})
