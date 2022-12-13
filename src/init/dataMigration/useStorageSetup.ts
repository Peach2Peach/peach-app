import { useEffect } from 'react'
import { useUserDataStore } from '../../store'
import { dataMigration } from './dataMigration'

export const useStorageSetup = () => {
  const userDataStore = useUserDataStore()
  const initialize = useUserDataStore((state) => state.initialize)

  useEffect(() => {
    ;(async () => {
      await dataMigration(userDataStore)
      initialize()
    })()
  }, [initialize])
}
