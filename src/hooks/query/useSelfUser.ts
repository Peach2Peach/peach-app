import { useQuery } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'

const getUserQuery = async () => {
  const { result: user, error } = await peachAPI.private.user.getSelfUser({})

  if (error) throw new Error(error.error)
  return user
}

export const useSelfUser = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['user', 'self'], queryFn: getUserQuery })
  return { user: data, isLoading, error }
}
