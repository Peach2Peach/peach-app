import { NewHeader as Header } from '../../../components'
import { useShowHelp } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const NodeSetupHeader = () => {
  const showHelp = useShowHelp('useYourOwnNode')
  return (
    <Header
      {...{
        title: i18n('wallet.settings.node.title'),
        icons: [
          {
            ...headerIcons.help,
            accessibilityHint: `${i18n('help')} ${i18n('wallet.settings.node.title')}`,
            onPress: showHelp,
          },
        ],
      }}
    />
  )
}
