import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const axiosInstanceS = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const {
    data: role,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [user?.email, "role"],
    queryFn: async () => {
      const responce = await axiosInstanceS.get(
        `/get-role?email=${user.email}`
      );
      return responce.data;
    },
    enabled: user?.email ? true : false,
  });
  return { role, isLoading, refetch };
};

export default useRole;
