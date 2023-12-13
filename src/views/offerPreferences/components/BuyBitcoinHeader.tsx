import { LogoIcons } from '../../../assets/logo'
import { Header, Text } from '../../../components'
import { HeaderProps } from '../../../components/Header'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export function BuyBitcoinHeader (props: HeaderProps) {
  return (
    <Header
      {...props}
      titleComponent={
        <>
          <Text style={tw`h7 md:h6 text-success-main`}>{i18n('buy')}</Text>
          <LogoIcons.bitcoinText style={tw`h-14px md:h-16px w-63px md:w-71px`} />
        </>
      }
    />
  )
}
