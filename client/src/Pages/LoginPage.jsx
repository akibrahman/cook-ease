import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SocialLogin from "../Components/Authorization/SocialLogin";
import { AuthContext } from "../Providers/AuthProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const url = location.state?.from?.pathname || "/";
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await logIn(data.email, data.password);
      toast.success("LogIn Succesfully", { autoClose: 2000 });
      navigate(url ? url : "/");
    } catch (error) {
      setLoading(false);
      toast.error(
        error.code == "auth/invalid-login-credentials"
          ? "Invalid User or Password"
          : error.code,
        { autoClose: 2000 }
      );
    }
  };

  return (
    <div
      data-aos="zoom-in-up"
      data-aos-duration="900"
      className="flex flex-col lg:flex-row items-center w-[95%] md:w-[70%] mx-auto shadow-xl my-10"
    >
      <div className="lg:w-1/2 p-5 md:p-10">
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={handleSubmit(handleLogin)}
        >
          <h1 className="font-bold text-3xl">Sign in</h1>
          <SocialLogin loader={setLoading} />
          <span>or use your account</span>
          <div className="w-full">
            <input
              className="w-full bg-[#f3f3f3] px-4 py-3"
              type="text"
              placeholder="Email"
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 font-medium">You E-mail is Required</p>
            )}
            {errors.email?.type === "pattern" && (
              <p className="text-red-500 font-medium">
                Please Enter a Valid E-mail
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              className="w-full bg-[#f3f3f3] px-4 py-3"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: true,
              })}
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 font-medium">password is Required</p>
            )}
          </div>
          <a href="#" className="">
            Forgot your password?
          </a>
          <button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded-[20px] py-3 px-11 text-xs"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <p>Wait</p>
                <ImSpinner9 className="animate-spin" />
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>

      <div className="bg-gradient-to-r from-primary to-secondary w-full lg:w-1/2 flex flex-col items-center  h-full py-10 text-white rounded-md">
        <h1
          className="text-3xl font-semibold mb-10
        "
        >
          Hello, Friend!
        </h1>
        <p>Do not have an Account?</p>
        <Link to="/registration">
          <button className="border px-6 py-2 rounded-3xl mt-3">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
