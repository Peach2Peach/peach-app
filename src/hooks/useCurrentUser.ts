import { useProfileStore } from '../views/publicProfile/store'
import { useUserQuery } from './useUserQuery'

export const useCurrentUser = () => {
  const publicKey = useProfileStore((state) => state.currentUserPubkey)
  return useUserQuery(publicKey)
}
