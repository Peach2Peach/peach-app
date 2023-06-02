import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { Input, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type Props = {
  referralCode: string
  setReferralCode: Dispatch<SetStateAction<string>> | ((code: string) => void)
  referralCodeErrors: string[] | undefined
}
export const SetCustomReferralCode = ({ referralCode, setReferralCode, referralCodeErrors }: Props) => (
  <View>
    <Text>{i18n('settings.referrals.customReferralCode.popup.text')}</Text>
    <Input
      style={tw`mt-3 bg-primary-background-dark`}
      placeholder={i18n('form.referral.placeholder')}
      value={referralCode}
      onChange={setReferralCode}
      autoCapitalize="characters"
      errorMessage={referralCodeErrors}
    />
  </View>
)
