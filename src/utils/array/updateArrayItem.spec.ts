import { updateArrayItem } from './updateArrayItem'

type Data = {
  id: string
  key: string
  optional?: string
}
describe('updateArrayItem', () => {
  const data: Data = {
    id: '1',
    key: 'value',
  }
  const otherData: Data = {
    id: '2',
    key: 'value',
  }
  it('adds an item to the array if array is empty', () => {
    const result = updateArrayItem<Data>([], data.id, data)
    expect(result).toEqual([data])
  })
  it('adds an item to the array if element is not part of array', () => {
    const result = updateArrayItem<Data>([data], otherData.id, otherData)
    expect(result).toEqual([data, otherData])
  })
  it('updates an item of the array if element is part of array', () => {
    const optionalValues = {
      key: 'newValue',
      optional: 'optionalValue',
    }
    const updatedItem = {
      ...otherData,
      ...optionalValues,
    }
    const result = updateArrayItem<Data>([data, otherData], otherData.id, optionalValues)
    expect(result).toEqual([data, updatedItem])
  })
})
