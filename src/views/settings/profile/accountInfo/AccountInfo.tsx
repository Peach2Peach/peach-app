import { View } from 'react-native'
import { PeachText } from '../../../../components/text/PeachText'
import { CopyAble } from '../../../../components/ui/CopyAble'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { AccountCreated } from './AccountCreated'
import { Disputes } from './Disputes'
import { Trades } from './Trades'

type Props = {
  user: User | PublicUser
}

export const AccountInfo = ({ user }: Props) => (
  <View style={tw`gap-4 pl-1`}>
    <PublicKey publicKey={user.id} />
    <AccountCreated {...user} />
    <Disputes {...user.disputes} />
    <Trades {...user} />
  </View>
)

function PublicKey ({ publicKey }: { publicKey: string }) {
  return (
    <View style={tw`pr-3`}>
      <PeachText style={tw`lowercase text-black-65`}>{i18n('profile.publicKey')}:</PeachText>
      <View style={tw`flex-row items-center gap-3`}>
        <PeachText style={tw`uppercase text-black-100 subtitle-2 shrink`}>
          <PeachText style={tw`text-primary-main subtitle-2`}>{publicKey.slice(0, 8)}</PeachText>
          {publicKey.slice(8)}
        </PeachText>

        <CopyAble style={tw`w-7 h-7`} value={publicKey} />
      </View>
    </View>
  )
}
