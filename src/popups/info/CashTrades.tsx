import { BulletPoint } from '../../components/text/BulletPoint'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const CashTrades = () => {
  const bulletPoints = []
  for (let i = 1; i < 5; i++) bulletPoints.push(<BulletPoint key={i} text={i18n(`tradingCash.point.${i}`)} />)
  return (
    <>
      <PeachText style={tw`mb-3`}>{i18n('tradingCash.text')}</PeachText>
      {bulletPoints}
    </>
  )
}
