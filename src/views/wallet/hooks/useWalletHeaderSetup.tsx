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
            ...headerIcons.list,
            accessibilityHint: `${i18n('goTo')} ${i18n('wallet.transactionHistory')}`,
            onPress: () => navigation.navigate('transactionHistory'),
          },
          {
            ...headerIcons.bitcoin,
            accessibilityHint: `${i18n('goTo')} ${i18n('settings.networkFees')}`,
            onPress: () => navigation.navigate('networkFees'),
          },
          { ...headerIcons.help, accessibilityHint: `${i18n('help')}`, onPress: showHelp },
        ],
      },
  )
}
