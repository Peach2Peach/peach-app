import { useGlobalHandlers } from './useGlobalHandlers'

type Props = {
  currentPage: keyof RootStackParamList | undefined
}

export const GlobalHandlers = (props: Props) => {
  useGlobalHandlers(props)

  return <></>
}
