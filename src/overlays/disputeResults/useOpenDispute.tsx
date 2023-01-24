import React, { ReactElement, useCallback, useContext } from 'react'
import { Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { contract } from '../../../tests/unit/data/contractData'

const OpenDispute = (): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.openDispute.text.1')}</Text>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.openDispute.text.2')}</Text>
    <Text style={tw`body-m text-black-1`}>{i18n('dispute.openDispute.text.3')}</Text>
  </>
)

/**
 * @description Overlay for opening dispute from chat
 */
export const useOpenDispute = (contractId: string) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ visible: false })

  const ok = async () => {
    closeOverlay()
    navigation.navigate('dispute', { contractId })
  }

  const showOverlay = useCallback(() => {
    updateOverlay({
      title: i18n('dispute.openDispute'),
      level: 'WARN',
      content: <OpenDispute />,
      visible: true,
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeOverlay,
      },
      action2: {
        label: i18n('dispute.openDispute'),
        icon: 'alertOctagon',
        callback: ok,
      },
    })
  }, [updateOverlay, contract, navigation])
  return showOverlay
}
