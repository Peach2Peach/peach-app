type Item<T> = T & {
  id: string
}
export const updateArrayItem = <T>(items: Item<T>[], id: string, data: Partial<Item<T>>) => {
  let itemFound = false
  const updatedItems = items.map((contract) => {
    if (contract.id === id) {
      contract = {
        ...contract,
        ...data,
      }
      itemFound = true
    }
    return contract
  })

  if (!itemFound) {
    updatedItems.push(data as Required<Item<T>>)
  }

  return updatedItems
}
