import { InfoPopup } from '../popups/InfoPopup'
import { helpPopups } from '../popups/helpPopups'
import i18n from '../utils/i18n'

type Props = {
  id: string
  showTitle?: boolean
}

export function HelpPopup ({ id, showTitle = true }: Props) {
  const Content = helpPopups[id]?.content
  return (
    <InfoPopup
      title={showTitle ? helpPopups[id]?.title ?? i18n(`help.${id}.title`) : undefined}
      content={
        Content !== undefined ? typeof Content === 'string' ? Content : <Content /> : i18n(`help.${id}.description`)
      }
    />
  )
}
