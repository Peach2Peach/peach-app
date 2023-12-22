import { useCallback } from 'react'
import { useSetPopup } from '../components/popup/Popup'
import { PeachText } from '../components/text/PeachText'
import { InfoPopup } from '../popups/InfoPopup'
import { helpPopups } from '../popups/helpPopups'
import i18n from '../utils/i18n'

// TODO: remove
export const useShowHelp = (id: string, showTitle = true) => {
  const setPopup = useSetPopup()

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
    <InfoPopup
      title={showTitle ? helpPopups[id]?.title ?? i18n(`help.${id}.title`) : undefined}
      content={Content !== undefined ? <Content /> : <PeachText>{i18n(`help.${id}.description`)}</PeachText>}
    />
  )
}
