import React, { ReactElement } from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

type Props = {
  referralCode: string
}
export const SetCustomReferralCodeSuccess = ({ referralCode }: Props): ReactElement => (
  <Text>{i18n('settings.referrals.customReferralCode.popup.success', referralCode)}</Text>
)
