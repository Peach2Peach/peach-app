type Storage = {
  [key: string]: string;
}
const storage: Storage = {}

export default {
  getItem: async (id: string) => storage[id],
  setItem: async (id: string, value: string) => storage[id] = value,
}