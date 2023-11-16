import { Overlay } from '../../components/Overlay'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const BackupTime = () => {
  const navigation = useNavigation()
  const route = useRoute<'backupTime'>()
  const { nextScreen, ...params } = route.params
  const goToBackups = () => navigation.replace('backups')
  const skip = () => (nextScreen ? navigation.replace(nextScreen, params) : navigation.replace('buy'))

  return (
    <Overlay
      title={i18n('backupTime.title')}
      text={i18n('backupTime.description.mandatory')}
      iconId="saveCircleInverted"
      buttons={
        <>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToBackups}>
            {i18n('backupTime.makeABackup')}
          </Button>
          <Button ghost onPress={skip}>
            {i18n('backupTime.skipForNow')}
          </Button>
        </>
      }
    />
  )
}
