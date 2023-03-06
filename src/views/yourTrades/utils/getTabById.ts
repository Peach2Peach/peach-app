import { TabbedNavigationItem } from '../../../components/navigation/TabbedNavigation'

export const getTabById = (tabs: TabbedNavigationItem[], id: string) => tabs.find((t) => t.id === id)
