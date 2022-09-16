import { deepStrictEqual } from 'assert'
import tw from '../../../src/styles/tailwind'
import { shortToLongHex, addOpacityToColor } from '../../../src/utils/layout'


describe('shortToLongHex', () => {
  it('converts 3 digit hex colors to 6 digits', () => {
    deepStrictEqual(shortToLongHex('#000'), '#000000')
    deepStrictEqual(shortToLongHex('#0F0'), '#00FF00')
    deepStrictEqual(shortToLongHex('#F74'), '#FF7744')
  })
  it('keeps 6 digits', () => {
    deepStrictEqual(shortToLongHex('#000000'), '#000000')
    deepStrictEqual(shortToLongHex('#FF7744'), '#FF7744')
    deepStrictEqual(shortToLongHex('#F57940'), '#F57940')
  })
})

describe('addOpacityToColor', () => {
  it('converts regular hex color style into one with opacity value', () => {
    deepStrictEqual(addOpacityToColor(tw`text-black-1`, -1), { color: '#00000000' })
    deepStrictEqual(addOpacityToColor(tw`text-black-1`, 0), { color: '#00000000' })
    deepStrictEqual(addOpacityToColor(tw`text-black-1`, 0.25), { color: '#00000040' })
    deepStrictEqual(addOpacityToColor(tw`text-black-1`, 0.5), { color: '#00000080' })
    deepStrictEqual(addOpacityToColor(tw`text-black-1`, 1), { color: '#000000FF' })
    deepStrictEqual(addOpacityToColor(tw`text-black-1`, 2), { color: '#000000FF' })

    deepStrictEqual(addOpacityToColor(tw`text-peach-1`, -1), { color: '#AEC43500' })
    deepStrictEqual(addOpacityToColor(tw`text-peach-1`, 0), { color: '#AEC43500' })
    deepStrictEqual(addOpacityToColor(tw`text-peach-1`, 0.25), { color: '#AEC43540' })
    deepStrictEqual(addOpacityToColor(tw`text-peach-1`, 0.5), { color: '#AEC43580' })
    deepStrictEqual(addOpacityToColor(tw`text-peach-1`, 1), { color: '#AEC435FF' })
    deepStrictEqual(addOpacityToColor(tw`text-peach-1`, 2), { color: '#AEC435FF' })
  })
})
