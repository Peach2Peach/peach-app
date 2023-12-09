import { useNavigation } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useOfferPreferences } from '../../../store/offerPreferenes'

export const useBuySetup = () => {
  const navigation = useNavigation()
  const { user } = useSelfUser()
  const freeTrades = user?.freeTrades || 0
  const maxFreeTrades = user?.maxFreeTrades || 0
  const isLoading = useOfferPreferences((state) => state.buyAmountRange[1] === Infinity)

  const next = () => navigation.navigate('buyPreferences')

  return { freeTrades, maxFreeTrades, isLoading, next }
}
