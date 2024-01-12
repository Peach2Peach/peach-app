import { PeachText } from '../../../components/text/PeachText'
import { APPVERSION, BUILDNUMBER } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const VersionInfo = ({ style }: ComponentProps) => (
  <PeachText style={[tw`uppercase button-medium text-black-50`, style]}>
    {i18n('settings.peachApp')}
    {APPVERSION} ({BUILDNUMBER})
  </PeachText>
)
