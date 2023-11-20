import { useAccountStore } from '../account/account'

export const offerExists = (id: string): boolean => {
  const offers = useAccountStore.getState().account.offers
  return offers.some((o) => o.id === id)
}
