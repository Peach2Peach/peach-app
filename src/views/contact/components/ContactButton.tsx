import tw from '../../../styles/tailwind'
import { OptionButton } from '../../../components'
import i18n from '../../../utils/i18n'

type Props = { reason: ContactReason; setReason: (name: ContactReason) => void }

export const ContactButton = ({ reason, setReason }: Props) => (
  <OptionButton onPress={() => setReason(reason)} style={tw`w-full mb-4`} wide>
    {i18n(`contact.reason.${reason}`)}
  </OptionButton>
)
