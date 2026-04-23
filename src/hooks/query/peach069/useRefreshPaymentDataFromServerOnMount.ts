import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { user69DetailsKeys } from "./useUser69";

export const useRefreshPaymentDataFromServerOnMount = () => {
  const queryClient = useQueryClient();
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: user69DetailsKeys.details(),
      });
    }, [queryClient]),
  );
};
