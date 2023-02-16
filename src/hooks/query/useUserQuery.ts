import { useQuery } from '@tanstack/react-query'
import { getUser } from '../../utils/peachAPI'

const getUserQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, userId] = queryKey
  const [user] = await getUser({ userId })

  return user
}

export const useUser = (id: string) => {
  const { data, isLoading, error } = useQuery(['user', id], getUserQuery)

  return { user: data, isLoading, error }
}
