import { ReactElement } from 'react'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const OpenDispute = (): ReactElement => (
  <>
    <Text>{i18n('dispute.openDispute.text.1')}</Text>
    <Text style={tw`mt-3`}>{i18n('dispute.openDispute.text.2')}</Text>
    <Text style={tw`mt-3`}>{i18n('dispute.openDispute.text.3')}</Text>
  </>
)
