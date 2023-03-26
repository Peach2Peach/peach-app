import { ReactElement } from 'react';
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const ReferralsHelp = (): ReactElement => (
  <>
    <Text style={tw`mb-2`}>{i18n('help.referral.description.1')}</Text>
    <Text>{i18n('help.referral.description.2')}</Text>
  </>
)
