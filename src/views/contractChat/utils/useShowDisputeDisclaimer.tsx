import React, { useCallback, useContext } from 'react'
import {Text} from 'react-native'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { updateSettings } from '../../../utils/account'
import i18n from '../../../utils/i18n'

export const useShowDisputeDisclaimer = (contract?: Contract) => {
    const navigation = useNavigation()
    const [, updateOverlay] = useContext(OverlayContext)

    const showDisclaimer = useCallback(async () => {
        const goToHelp = () => {
            updateOverlay({
                visible: false,
            })
            navigation.navigate('contact')
        }

        updateOverlay({
            title: i18n('trade.chat'),
            level: 'INFO',
            content: <Text style={tw`body-s text-black-1`}>{i18n('chat.disputeDisclaimer')}</Text>,
            visible: true,
            action1: {
                callback: () => {
                    updateSettings({ showDisputeDisclaimer: false }, true)
                    updateOverlay({visible: false})
                },
                label: i18n('close'),
                icon: 'info',
            },
            action2: {
                callback: goToHelp,
                label: i18n('help'),
                icon: 'info',
            },
            
        })
    }, [contract, navigation, updateOverlay])

    return showDisclaimer
}
