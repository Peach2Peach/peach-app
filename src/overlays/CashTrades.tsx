import { Text } from '../components'
import { BulletPoint } from '../components/text'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const CashTrades = () => {
  const bulletPoints = []
  for (let i = 1; i < 5; i++) bulletPoints.push(<BulletPoint text={i18n(`tradingCash.point.${i}`)} />)
  return (
    <>
      <Text style={tw`mb-3`}>{i18n('tradingCash.text')}</Text>
      {bulletPoints}
    </>
  )
}
