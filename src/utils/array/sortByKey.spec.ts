import { sortByKey } from './sortByKey'

describe('sortByKey', () => {
  const data = [
    { date: new Date('2022-01-03'), value: 3 },
    { date: new Date('2022-01-01'), value: 1 },
    { date: new Date('2022-01-02'), value: 2 },
    { date: new Date('2020-01-01'), value: 0 },
  ]
  it('should sort an array of objects by key', () => {
    expect(data.sort(sortByKey('date'))).toEqual([
      { date: new Date('2020-01-01'), value: 0 },
      { date: new Date('2022-01-01'), value: 1 },
      { date: new Date('2022-01-02'), value: 2 },
      { date: new Date('2022-01-03'), value: 3 },
    ])
    expect(data.sort(sortByKey('value'))).toEqual([
      { date: new Date('2020-01-01'), value: 0 },
      { date: new Date('2022-01-01'), value: 1 },
      { date: new Date('2022-01-02'), value: 2 },
      { date: new Date('2022-01-03'), value: 3 },
    ])
  })
  it('should sort an array of objects by key in descending order', () => {
    expect(data.sort(sortByKey('date', 'desc'))).toEqual([
      { date: new Date('2022-01-03'), value: 3 },
      { date: new Date('2022-01-02'), value: 2 },
      { date: new Date('2022-01-01'), value: 1 },
      { date: new Date('2020-01-01'), value: 0 },
    ])
    expect(data.sort(sortByKey('value', 'desc'))).toEqual([
      { date: new Date('2022-01-03'), value: 3 },
      { date: new Date('2022-01-02'), value: 2 },
      { date: new Date('2022-01-01'), value: 1 },
      { date: new Date('2020-01-01'), value: 0 },
    ])
  })

  it('should return an empty array if the input array is empty', () => {
    expect([].sort(sortByKey('date'))).toEqual([])
  })
})
