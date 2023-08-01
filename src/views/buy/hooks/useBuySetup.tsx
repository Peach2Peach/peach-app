import { useHeaderSetup, useShowHelp } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { BuyTitleComponent } from '../components/BuyTitleComponent'

export const useBuySetup = () => {
  const { user } = useSelfUser()
  const freeTrades = user?.freeTrades || 0
  const maxFreeTrades = user?.maxFreeTrades || 0
  const showHelp = useShowHelp('buyingBitcoin')

  useHeaderSetup({
    titleComponent: <BuyTitleComponent />,
    hideGoBackButton: true,
    icons: [{ ...headerIcons.help, onPress: showHelp }],
    showPriceStats: true,
  })

  return { freeTrades, maxFreeTrades }
}
