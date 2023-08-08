import { Alert } from 'react-native'
import { useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { NewHeader } from '../../../components'

export const WalletHeader = () => {
  const navigation = useNavigation()
  const showHelp = useShowHelp('withdrawingFunds')
  return (
    <NewHeader
      {...{
        title: i18n('wallet.title'),
        hideGoBackButton: true,
        icons: [
          {
            ...headerIcons.search,
            accessibilityHint: `${i18n('goTo')} ${i18n('wallet.addressChecker')}`,
            onPress: () => Alert.alert('TODO: Go to address checker'),
          },
          {
            ...headerIcons.list,
            accessibilityHint: `${i18n('goTo')} ${i18n('wallet.transactionHistory')}`,
            onPress: () => navigation.navigate('transactionHistory'),
          },
          { ...headerIcons.help, accessibilityHint: `${i18n('help')}`, onPress: showHelp },
        ],
      }}
    />
  )
}
