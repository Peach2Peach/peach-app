import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useShowHelp } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { BuyTitleComponent } from '../components/BuyTitleComponent'

export const useBuySetup = () => {
  const navigation = useNavigation()
  const { user } = useSelfUser()
  const freeTrades = user?.freeTrades || 0
  const maxFreeTrades = user?.maxFreeTrades || 0
  const showHelp = useShowHelp('buyingBitcoin')
  const [isLoading, rangeIsValid] = useOfferPreferences(
    (state) => [state.buyAmountRange[1] === Infinity, state.canContinue.buyAmountRange],
    shallow,
  )

  useHeaderSetup({
    titleComponent: <BuyTitleComponent />,
    hideGoBackButton: true,
    icons: [{ ...headerIcons.help, onPress: showHelp }],
    showPriceStats: true,
  })

  const next = () => navigation.navigate('buyPreferences')

  return { freeTrades, maxFreeTrades, isLoading, rangeIsValid, next }
}
