import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useUser = () => {
  const axiosInstanceS = useAxiosSecure();
  const { user: fireBaseUser } = useContext(AuthContext);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [fireBaseUser?.email, "user"],
    queryFn: async () => {
      const responce = await axiosInstanceS.get(
        `/get-user?email=${fireBaseUser.email}`
      );
      return responce.data;
    },
    enabled: fireBaseUser?.email ? true : false,
  });
  return { user, isLoading, refetch };
};

export default useUser;
