import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { HelpType } from '../../../popups/helpPopups'
import { useConfigStore } from '../../../store/configStore'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { SellTitleComponent } from '../components'

type Props = {
  help: HelpType
  hideGoBackButton?: boolean
}
export const useSellSetup = ({ help, hideGoBackButton }: Props) => {
  const navigation = useNavigation()
  const isAmountValid = useOfferPreferences((state) => state.canContinue.sellAmount)
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount)
  const showHelp = useShowHelp(help)

  useHeaderSetup({
    titleComponent: <SellTitleComponent />,
    hideGoBackButton,
    icons: [{ ...headerIcons.help, onPress: showHelp }],
    showPriceStats: true,
  })

  const next = () => navigation.navigate('premium')

  return {
    isAmountValid,
    isLoading: minTradingAmount === 0,
    next,
  }
}
