import { useCallback } from 'react'
import { PopupAction } from '../components/popup/PopupAction'
import { PopupComponent, PopupComponentProps } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks/useNavigation'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { ClosePopupAction } from './actions/ClosePopupAction'

export function InfoPopup (props: Pick<PopupComponentProps, 'title' | 'content'>) {
  return (
    <PopupComponent
      {...props}
      actions={
        <>
          <HelpPopupAction title={props.title} />
          <ClosePopupAction reverseOrder />
        </>
      }
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
    />
  )
}

function HelpPopupAction ({ title }: { title?: string }) {
  const navigation = useNavigation()
  const closePopup = usePopupStore((state) => state.closePopup)
  const goToHelp = useCallback(() => {
    closePopup()
    navigation.navigate('report', { topic: title, reason: 'other' })
  }, [closePopup, navigation, title])
  return <PopupAction label={i18n('help')} iconId="info" onPress={goToHelp} />
}
