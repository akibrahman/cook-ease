import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import Loader from "../../Components/Shared/Loader";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthProvider";

const MyProfile = () => {
  const { user: authUser } = useContext(AuthContext);
  const axiosInstanceS = useAxiosSecure();

  const { data: user, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await axiosInstanceS.get(
        `/my-profile?email=${authUser.email}`
      );
      return res.data;
    },
    enabled: authUser ? true : false,
  });

  if (!user || isLoading || !authUser) return <Loader />;
  return (
    <div className="w-[900px] my-20">
      <p className="font-semibold text-xl text-white bg-primary py-2 text-center w-full">
        My profile
      </p>
      <div className="relative flex items-center justify-center gap-10 my-16">
        <img
          src={authUser.photoURL}
          className="w-80 h-80 rounded-full border-4 border-primary"
          alt=""
        />
        <div className="border-l-2 border-primary pl-3 font-semibold text-lg">
          <p>
            <span className="font-black mr-3">Name: </span>
            {user.name}
          </p>
          <p>
            <span className="font-black mr-3">E-mail:</span> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
