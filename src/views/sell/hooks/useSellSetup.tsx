import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { HelpType } from '../../../popups/helpPopups'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { SellTitleComponent } from '../components'

type Props = {
  help: HelpType
  hideGoBackButton?: boolean
}
export const useSellSetup = ({ help, hideGoBackButton }: Props) => {
  const showHelp = useShowHelp(help)

  useHeaderSetup({
    titleComponent: <SellTitleComponent />,
    hideGoBackButton,
    icons: [{ ...headerIcons.help, onPress: showHelp }],
    showPriceStats: true,
  })
}
