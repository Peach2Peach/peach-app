import { useQuery } from '@tanstack/react-query'
import { getSelfUser } from '../../utils/peachAPI'

const getUserQuery = async () => {
  const [user] = await getSelfUser({})

  return user
}

export const useSelfUser = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['user', 'self'], queryFn: getUserQuery })
  return { user: data, isLoading, error }
}
