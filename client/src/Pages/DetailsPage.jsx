import { useQuery } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { AwesomeButtonProgress } from "react-awesome-button";
import { FaHeart, FaRegSmileBeam, FaRegStar, FaStar } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";
import Rating from "react-rating";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Container from "../Components/Shared/Container";
import Loader from "../Components/Shared/Loader";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import usePackage from "../Hooks/usePackage";
import { AuthContext } from "../Providers/AuthProvider";
import { convertCamelCaseToCapitalized } from "../Utils/camelToCapitalize";

const DetailsPage = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState("");
  const [likeLoader, setLikeLoader] = useState(false);
  const axiosInstance = useAxiosPublic();
  const navigate = useNavigate();
  const userPackage = usePackage();
  const mealAdder = useRef();

  const {
    data: meal,
    refetch: mealRefetch,
    isLoading: isMealLoading,
  } = useQuery({
    queryKey: ["sigleMeal", id],
    queryFn: async () => {
      const data = await axiosInstance.get(`/meal/${id}`);
      return data.data;
    },
  });

  const {
    data: isLiked,
    isLoading: isLikedLoad,
    refetch: isLikedRefetch,
  } = useQuery({
    queryKey: ["isLiked", id],
    queryFn: async () => {
      const data = await axiosInstance.get(
        `/is-liked?id=${id}&email=${user.email}`
      );
      return data.data.liked;
    },
    enabled: !loading && id ? true : false,
  });

  const { data: reviews, refetch: reviewRefetch } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const data = await axiosInstance.get(`/meal-wise-reviews?id=${id}`);
      return data.data;
    },
  });

  const handleLikeInc = async () => {
    if (!user) {
      Swal.fire({
        title: "You are not Logged In",
        text: "You have to login to give Reaction !",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Page",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    setLikeLoader(true);
    await axiosInstance.put("/inc-like", {
      email: user.email,
      id: id,
    });
    await isLikedRefetch();
    await mealRefetch();
    setLikeLoader(false);
  };
  const handleLikeDec = async () => {
    setLikeLoader(true);
    await axiosInstance.put("/dec-like", {
      email: user.email,
      id: id,
    });
    await isLikedRefetch();
    await mealRefetch();
    setLikeLoader(false);
  };

  const handlePostReview = async (event) => {
    event.preventDefault();

    if (!user) {
      Swal.fire({
        title: "You are not Logged In",
        text: "You have to login to Post a Review !",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Page",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    const review = event.target.review.value;
    if (!review) {
      setError("Review is Required");
      return;
    }
    if (!rating) {
      setError("Rating is Required");
      return;
    }
    setError("");
    const data = {
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      rating: rating,
      review: review,
      mealId: id,
    };
    try {
      await axiosInstance.post("/add-review", data);
      mealRefetch();
      toast.success("Review Added");
      event.target.reset();
      setRating(null);
      reviewRefetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRequest = async () => {
    if (!user) {
      mealAdder.current.next(false, "No User");
      Swal.fire({
        title: "You are not Logged In",
        text: "You have to login to request a meal !",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Page",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    if (userPackage.pack.split("-")[1] == undefined) {
      toast.info("You First have to Subscribe a Package to request a Meal");
      mealAdder.current.next(false, "No Package");
      return;
    }

    const isExist = await axiosInstance.get(
      `/check-requested-meal?id=${id}&email=${user.email}`
    );
    if (isExist.data) {
      toast.info("You have already Requested for this Meal");
      mealAdder.current.next(false, "Alredy Requested");
      return;
    } else {
      const requestData = {
        name: user.displayName,
        email: user.email,
        mealId: id,
        mealTitle: meal.mealTitle,
        status: "pending",
      };
      const response = await axiosInstance.post(
        "/add-requested-meal",
        requestData
      );
      if (response.data.acknowledged) {
        mealAdder.current.next(true);
        setTimeout(() => {
          toast.success("Meal Requested Sucessfully");
        }, 600);
        return;
      }
    }
    toast.error("Something went wrong!");
    mealAdder.current.next(false, "Error");
  };

  if (loading || isLikedLoad || isMealLoading) return <Loader />;

  return (
    <Container>
      <div className="flex flex-col md:flex-row items-center gap-10 my-6 text-white">
        <div className="w-[95%] mx-auto md:w-1/2">
          <img
            className="rounded-md w-full h-[400px]"
            src={meal.mealImage}
            alt=""
          />
        </div>
        <div
          className="w-[95%] mx-auto md:w-1/2
         border-l-4 border-primary pl-5 space-y-5"
        >
          <p className="text-3xl font-medium mb-5">{meal.mealTitle}</p>
          <p className="border w-max px-3 rounded-full font-medium mb-3">
            {convertCamelCaseToCapitalized(meal.mealType)}
          </p>
          <p>
            <span className="font-bold text-stone-200 mr-4">Post Time:</span>{" "}
            {new Date(meal.postTime).toLocaleString()}
          </p>
          <p>
            <span className="font-bold text-stone-200 mr-4">Distributor:</span>{" "}
            {meal.distributorName}
          </p>
          <div className="flex flex-wrap gap-2 my-3">
            <span className="font-bold text-stone-200 mr-4">Ingredients: </span>{" "}
            {meal.ingredients.map((inn, i) => (
              <p className="ml-2 border rounded-full px-[6px] w-max" key={i}>
                {inn}
              </p>
            ))}
          </div>
          <p>
            <span className="font-bold text-stone-200 mr-4">Description: </span>
            {meal.description}
          </p>
          <p className="flex items-center gap-2 text-xl mt-4">
            <span className="font-bold text-stone-200 mr-4">Price: </span>
            <span className="flex items-center gap-1 font-semibold">
              <FaBangladeshiTakaSign />
              {meal.price}
            </span>
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <Rating
                readonly
                placeholderRating={meal.rating}
                emptySymbol={<FaRegStar className="text-3xl" />}
                placeholderSymbol={<FaStar className="text-3xl" />}
                fullSymbol={<FaStar className="text-primary text-3xl" />}
              />
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-5 font-semibold">
                  {likeLoader ? (
                    <ImSpinner9 className="animate-spin text-3xl" />
                  ) : isLiked ? (
                    <FaHeart
                      onClick={handleLikeDec}
                      className="text-3xl text-red-600 cursor-pointer"
                    />
                  ) : (
                    <FaHeart
                      onClick={handleLikeInc}
                      className="text-3xl text-gray-300 cursor-pointer"
                    />
                  )}

                  <p>Likes: {meal.likes}</p>
                </div>
                <AwesomeButtonProgress
                  onPress={async (e, next) => {
                    mealAdder.current = { next };
                    setTimeout(() => {
                      handleRequest();
                    }, 600);
                  }}
                  type="primary"
                >
                  Request Meal
                </AwesomeButtonProgress>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reviews  */}
      <hr />
      <div className="my-8 border p-5 rounded-md border-primary bg-white">
        <p className="border-l-4 border-primary pl-2 text-xl mb-2">
          Total Reviews: {meal.numReviews}
        </p>
        <div className="">
          <form onSubmit={handlePostReview}>
            <textarea
              name="review"
              rows="4"
              className="border border-secondary rounded-md p-2 px-4 font-semibold text-primary w-full"
            ></textarea>

            <br />
            <div className="mt-3 flex items-center gap-3">
              <Rating
                onChange={(e) => setRating(e)}
                placeholderRating={rating}
                emptySymbol={<FaRegStar className="text-3xl" />}
                placeholderSymbol={<FaStar className="text-3xl" />}
                fullSymbol={<FaStar className="text-3xl" />}
              />
              <p className="text-red-600 font-bold">{error}</p>
            </div>
            <br />
            <button className="bg-secondary px-3 py-1 rounded-full font-semibold select-none text-white transition active:scale-90">
              Post
            </button>
          </form>
        </div>
        {reviews?.length == 0 ? (
          <p className="text-center py-5 font-semibold text-lg flex items-center justify-center">
            Be the First who Reviews....
            <FaRegSmileBeam />
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10">
            {reviews?.map((review, i) => (
              <div
                key={i}
                className="border border-secondary rounded-md p-2 pb-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={review.image}
                    className="w-9 h-9 rounded-full"
                    alt=""
                  />
                  <div className="">
                    <p>{review.name}</p>
                    <Rating
                      readonly
                      placeholderRating={review.rating}
                      emptySymbol={<FaRegStar />}
                      placeholderSymbol={<FaStar />}
                      fullSymbol={<FaStar />}
                    />
                  </div>
                </div>
                <p className="mt-3">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default DetailsPage;
