import React from 'react'
import tw from '../../../styles/tailwind'
import { OptionButton } from '../../../components'
import i18n from '../../../utils/i18n'

type Props = { name: ContactReason; setReason: Function }

export const ContactButton = ({ name, setReason }: Props) => (
  <OptionButton onPress={() => setReason(name)} style={tw`w-full mb-4`} wide>
    {i18n(`contact.reason.${name}`)}
  </OptionButton>
)
