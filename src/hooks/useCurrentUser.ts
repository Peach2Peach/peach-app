import { useProfileStore } from '../views/publicProfile/store'
import { useUser } from './query/useUserQuery'

export const useCurrentUser = () => {
  const publicKey = useProfileStore((state) => state.currentUserPubkey)
  return useUser(publicKey)
}
