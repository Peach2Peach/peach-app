import { ParsedPeachText } from '../../components/text/ParsedPeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type Props = {
  referralCode: string
}
export const SetCustomReferralCodeSuccess = ({ referralCode }: Props) => (
  <ParsedPeachText parse={[{ pattern: new RegExp(referralCode, 'u'), style: tw`text-primary-main` }]}>
    {i18n('settings.referrals.customReferralCode.popup.success', referralCode)}
  </ParsedPeachText>
)
