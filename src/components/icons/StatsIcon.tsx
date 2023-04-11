import tw from '../../styles/tailwind'
import Icon from '../Icon'

export const StatsIcon = () => (
  <>
    <Icon id={'alignJustify'} style={tw`absolute`} color={tw`text-primary-mild-1`.color} />
    <Icon id={'alignLeft'} color={tw`text-primary-dark-1`.color} />
  </>
)
