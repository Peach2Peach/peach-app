import { LogoIcons } from '../../../assets/logo'
import { Header, HeaderProps } from '../../../components/Header'
import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export function BuyBitcoinHeader (props: HeaderProps) {
  return (
    <Header
      {...props}
      titleComponent={
        <>
          <PeachText style={tw`h7 md:h6 text-success-main`}>{i18n('buy')}</PeachText>
          <LogoIcons.bitcoinText style={tw`h-14px md:h-16px w-63px md:w-71px`} />
        </>
      }
    />
  )
}
