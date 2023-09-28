import { useCallback } from 'react'
import { Text } from '../components'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks'
import { ClosePopupAction } from '../popups/actions'
import { helpPopups } from '../popups/helpPopups'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const useShowHelp = (id: string, showTitle = true) => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showHelp = useCallback(() => {
    setPopup(<HelpPopup id={id} showTitle={showTitle} />)
  }, [id, setPopup, showTitle])

  return showHelp
}

type Props = {
  id: string
  showTitle?: boolean
}

export function HelpPopup ({ id, showTitle }: Props) {
  const Content = helpPopups[id]?.content
  return (
    <PopupComponent
      title={showTitle ? helpPopups[id]?.title ?? i18n(`help.${id}.title`) : undefined}
      content={Content !== undefined ? <Content /> : <Text>{i18n(`help.${id}.description`)}</Text>}
      actions={
        <>
          <HelpPopupAction />
          <ClosePopupAction reverseOrder />
        </>
      }
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
    />
  )
}

function HelpPopupAction () {
  const navigation = useNavigation()
  const closePopup = usePopupStore((state) => state.closePopup)
  const goToHelp = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [navigation, closePopup])
  return <PopupAction label={i18n('help')} iconId="info" onPress={goToHelp} />
}
