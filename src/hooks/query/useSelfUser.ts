import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

const getUserQuery = async () => {
  const { result, error } = await peachAPI.private.user.getSelfUser();

  if (error) throw new Error(error.message);
  return result;
};

export const useSelfUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user", "self"],
    queryFn: getUserQuery,
  });
  return { user: data, isLoading };
};
