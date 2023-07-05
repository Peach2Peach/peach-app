import { Alert, View } from 'react-native'
import { Icon, Text } from '../../../components'
import { StatusCard, StatusCardProps } from '../../../components/statusCard/StatusCard'
import { MSINADAY } from '../../../constants'
import tw from '../../../styles/tailwind'
import { getShortDateFormat } from '../../../utils/date'

const defaultProps: StatusCardProps = {
  title: 'trade 1',
  icon: undefined,
  amount: 615000,
  currency: 'EUR' as Currency,
  price: 133.7,
  subtext: getShortDateFormat(new Date()),
  onPress: () => Alert.alert('Action works'),
  label: 'action label',
  labelIcon: <Icon id="alertCircle" size={16} color={tw`text-error-main`.color} />,
  color: 'primary',
}
export const StatusCards = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Status Cards</Text>
    <StatusCard {...defaultProps} />
    <StatusCard
      {...{ ...defaultProps }}
      subtext={getShortDateFormat(new Date(Date.now() - MSINADAY))}
      title="with icon"
      icon={<Icon id="upload" style={tw`w-4`} color={tw`text-success-main`.color} />}
    />
    <StatusCard {...defaultProps} subtext={getShortDateFormat(new Date(Date.now() - 2 * MSINADAY))} color="info" />
    <StatusCard {...defaultProps} color="warning" />
    <StatusCard {...defaultProps} title="no action" label={undefined} />
  </View>
)
