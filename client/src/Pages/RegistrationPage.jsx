import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SocialLogin from "../Components/Authorization/SocialLogin";
import { AuthContext } from "../Providers/AuthProvider";
// import { imageUploader } from "../Utils/imageUploder";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { registration, updateUserProfile, setAuthReloader, authReloader } =
    useContext(AuthContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleRegistration = async (data) => {
    setLoader(true);
    try {
      await registration(data.email, data.password);
      // const { display_url: imageURL } = await imageUploader(data.image[0]);
      await updateUserProfile(data.name);

      toast.success("Registered Succesfully", { autoClose: 2000 });
      setLoader(false);
      setAuthReloader(!authReloader);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.code, { autoClose: 2000 });
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse items-center w-[95%] lg:w-[70%] mx-auto shadow-xl my-10">
      <div className="lg:w-1/2 p-5 md:p-10">
        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="flex flex-col gap-4 items-center"
        >
          <h1 className="font-bold text-3xl">Registration</h1>
          <SocialLogin loader={setLoader} />
          <span>or use E-mail & Password to create</span>
          <div className="w-full">
            <input
              className="w-full bg-[#f3f3f3] px-4 py-3"
              type="text"
              placeholder="Name"
              name="name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 font-medium">You Name is Required</p>
            )}
          </div>

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
            <label className=""></label>
          </div>
          <div className="w-full">
            <input
              className="w-full bg-[#f3f3f3] px-4 py-3"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: true,
                minLength: 6,
                pattern: /.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-].*/,
              })}
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 font-medium">password is Required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 font-medium">
                password should be more that 6 Charecter
              </p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="text-red-500 font-medium">
                password should contail atleast one Special Charecter
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary text-white font-bold uppercase rounded-[20px] py-3 px-11 text-xs"
          >
            {loader ? (
              <div className="flex items-center gap-2">
                <p>Wait</p>
                <ImSpinner9 className="animate-spin" />
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>

      <div className="bg-gradient-to-r from-primary to-secondary w-full lg:w-1/2 flex flex-col items-center  h-full py-10 text-white rounded-md">
        <h1
          className="text-3xl font-semibold mb-10
        "
        >
          Welcome Back!
        </h1>
        <p>Already have an Account?</p>
        <Link to="/login">
          <button className="border px-6 py-2 rounded-3xl mt-3">Log In</button>
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;
