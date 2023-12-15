import { useCallback } from 'react'
import { PeachText } from '../components/text/PeachText'
import { InfoPopup } from '../popups/InfoPopup'
import { helpPopups } from '../popups/helpPopups'
import { usePopupStore } from '../store/usePopupStore'
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

function HelpPopup ({ id, showTitle }: Props) {
  const Content = helpPopups[id]?.content
  return (
    <InfoPopup
      title={showTitle ? helpPopups[id]?.title ?? i18n(`help.${id}.title`) : undefined}
      content={Content !== undefined ? <Content /> : <PeachText>{i18n(`help.${id}.description`)}</PeachText>}
    />
  )
}
