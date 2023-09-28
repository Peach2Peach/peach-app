import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { HelpPopup } from '../../../hooks/useShowHelp'
import { usePopupStore } from '../../../store/usePopupStore'
import { NodeSetupHeader } from './NodeSetupHeader'

const wrapper = NavigationWrapper

describe('NodeSetupHeader', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NodeSetupHeader />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should open help popup', () => {
    const { getByAccessibilityHint } = render(<NodeSetupHeader />, { wrapper })

    fireEvent.press(getByAccessibilityHint('help use your own node'))
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      popupComponent: <HelpPopup id="useYourOwnNode" showTitle={true} />,
    })
  })
})
