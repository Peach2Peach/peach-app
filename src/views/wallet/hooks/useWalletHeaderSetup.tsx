import { Alert } from 'react-native'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const useWalletHeaderSetup = (isLoading: boolean) => {
  const navigation = useNavigation()
  const showHelp = useShowHelp('withdrawingFunds')

  useHeaderSetup(
    isLoading
      ? {}
      : {
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
      },
  )
}
