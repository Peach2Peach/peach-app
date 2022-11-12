import React, { ReactElement } from 'react'
import { StackNavigation } from '../../utils/navigation'
import TradingView from '../TradingView'
type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => <TradingView {...{ navigation, page: 'buy' }} />
