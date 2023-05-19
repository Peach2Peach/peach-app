
import tw from '../../styles/tailwind'

import { PeachScrollView } from '../../components'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { NoMatchesYet } from './components'
import { WithMatches } from './components/WithMatches'
import { useSearchSetup } from './hooks/useSearchSetup'

export default () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <>
      <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`justify-center flex-grow pt-5 pb-6`} bounces={false}>
        {hasMatches ? <WithMatches offer={offer} /> : <NoMatchesYet offer={offer} style={tw`h-full px-6`} />}
      </PeachScrollView>
      {hasMatches && <DailyTradingLimit />}
    </>
  )
}
