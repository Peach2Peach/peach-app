import { View } from 'react-native'
import { Icon } from '../../components/Icon'
import { ParsedPeachText } from '../../components/text/ParsedPeachText'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n, { languageState } from '../../utils/i18n'
import { getLocalizedLink } from '../../utils/web/getLocalizedLink'
import { openURL } from '../../utils/web/openURL'

const goToEscrowInfo = () => openURL(getLocalizedLink('terms-and-conditions', languageState.locale))

export const Escrow = () => (
  <View style={tw`gap-4`}>
    <ParsedPeachText
      parse={[
        {
          pattern: new RegExp(i18n('help.escrow.description.link'), 'u'),
          style: tw`underline`,
          onPress: goToEscrowInfo,
        },
      ]}
    >
      {i18n('help.escrow.description')}
    </ParsedPeachText>
    <InfoText>{i18n('help.escrow.description.proTip')}</InfoText>
    <InfoText>{i18n('help.escrow.description.proTip.2')}</InfoText>
  </View>
)

function InfoText ({ children }: { children: string }) {
  return (
    <View style={tw`flex-row items-center gap-3`}>
      <Icon id="info" size={32} color={tw.color('black-100')} />
      <PeachText style={tw`shrink`}>{children}</PeachText>
    </View>
  )
}
