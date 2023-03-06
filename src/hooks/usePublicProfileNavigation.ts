import { useCallback } from 'react'

import { useProfileStore } from '../views/publicProfile/store'
import { useNavigation } from './useNavigation'

export const usePublicProfileNavigation = (pubKey: string) => {
  const navigation = useNavigation()
  const setCurrentUserPubkey = useProfileStore((state) => state.setCurrentUserPubkey)
  const goToUserProfile = useCallback(() => {
    setCurrentUserPubkey(pubKey)
    navigation.navigate('publicProfile')
  }, [pubKey, setCurrentUserPubkey, navigation])

  return goToUserProfile
}
