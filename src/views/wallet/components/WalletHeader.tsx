import { Header } from '../../../components'
import { useNavigation } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const WalletHeader = () => {
  const navigation = useNavigation()
  return (
    <Header
      title={i18n('wallet.title')}
      hideGoBackButton
      icons={[
        {
          ...headerIcons.search,
          accessibilityHint: `${i18n('goTo')} ${i18n('wallet.addressChecker')}`,
          onPress: () => navigation.navigate('addressChecker'),
        },
        {
          ...headerIcons.list,
          accessibilityHint: `${i18n('goTo')} ${i18n('wallet.transactionHistory')}`,
          onPress: () => navigation.navigate('transactionHistory'),
        },
      ]}
    />
  )
}
