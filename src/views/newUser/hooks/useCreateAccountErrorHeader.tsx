import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import i18n from '../../../utils/i18n'

export const useCreateAccountErrorHeader = () => {
  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: true,
  })
}
