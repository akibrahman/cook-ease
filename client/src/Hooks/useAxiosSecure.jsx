import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_serverUrl}`,
  withCredentials: true,
});
const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut, auth, setUser, setLoading } = useContext(AuthContext);
  //!
  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        // console.log("Tracked in the Axios Interceptor - ", error.response);
        if (error.response.status === 401 || error.response.status === 403) {
          console.log("Problem with Token - ", error.response.status);
          logOut(auth)
            .then(() => {
              setUser(null);
              setLoading(true);
              navigate("/login");
            })
            .catch();
        }
      }
    );
  }, [auth]);
  //!
  return axiosInstance;
};

export default useAxiosSecure;
