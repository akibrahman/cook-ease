import { useContext } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Providers/AuthProvider";

const SocialLogin = ({ loader }) => {
  const { GoogleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      loader(true);
      await GoogleLogin();
      toast.success("Logged In by Google");
      navigate("/");
      loader(false);
    } catch (error) {
      console.log(error);
      toast.error(error.code);
      loader(false);
    }
  };
  return (
    <div className="flex gap-4">
      <a
        href="#"
        onClick={handleGoogleLogin}
        className="border rounded-full p-2"
      >
        <AiOutlineGoogle className="text-xl"></AiOutlineGoogle>
      </a>
      {/* <a
        href="#"
        onClick={handleGithubLogin}
        className="border rounded-full p-2"
      >
        <AiFillGithub className="text-xl"></AiFillGithub>
      </a> */}
    </div>
  );
};

export default SocialLogin;
