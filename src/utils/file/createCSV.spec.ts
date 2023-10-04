import { createCSV } from './createCSV'

describe('createCSV', () => {
  it('should create a CSV file', () => {
    const data = [
      { name: 'John', age: 21 },
      { name: 'Jane', age: 22 },
    ]
    const headers = ['name', 'age']
    const fields = {
      name: (d: (typeof data)[number]) => d.name,
      age: (d: (typeof data)[number]) => d.age,
    }
    const csv = createCSV(data, headers, fields)
    expect(csv).toBe('name, age\nJohn, 21\nJane, 22\n')
  })
})
