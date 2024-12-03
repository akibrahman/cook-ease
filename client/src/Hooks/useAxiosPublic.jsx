import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_serverUrl}`,
});
const useAxiosPublic = () => {
  return axiosInstance;
};

export default useAxiosPublic;
