import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import i18n from '../../../utils/i18n'

export const useBackupHeader = () => {
  useOnboardingHeader({ title: i18n('restoreBackup.title') })
}
