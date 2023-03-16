import { useQuery } from '@tanstack/react-query'
import { getUserPrivate } from '../../utils/peachAPI'

const getUserQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, userId] = queryKey
  const [user] = await getUserPrivate({ userId })

  return user
}

export const useUserPrivate = (id: string) => {
  const { data, isLoading, error } = useQuery(['user', id], getUserQuery)

  return { user: data, isLoading, error }
}
