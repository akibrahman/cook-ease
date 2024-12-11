import useUser from "../../Hooks/useUser";
import { CiCirclePlus } from "react-icons/ci";
import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Modal from "react-modal";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdDelete } from "react-icons/md";

const Meal = ({ day, meal }) => {
  const { user, isLoading: userIsLoading } = useUser();
  const axiosInstanceS = useAxiosSecure();
  const [showModal, setShowModal] = useState([false, "", "", ""]);

  const {
    data,
    isLoading,
    refetch: mealRefetch,
  } = useQuery({
    queryKey: [day, meal, user?._id],
    queryFn: async ({ queryKey }) => {
      const responce = await axiosInstanceS.get(
        `/get-meal?userId=${queryKey[2]}&day=${queryKey[0]}&meal=${queryKey[1]}`
      );
      if (responce.data.success)
        return {
          image: responce.data.image,
          name: responce.data.name,
          mealId: responce.data.mealId,
        };
      else return null;
    },
    enabled: user && !userIsLoading ? true : false,
  });

  const addMeal = async (day, meal, userId) => {
    try {
      if (!day || !meal || !userId) throw new Error("Missing Data");
      setShowModal([true, day, meal, userId]);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Error, Try Again!"
      );
    }
  };

  const deleteMeal = async (day, meal, userId, mealId) => {
    try {
      console.log(day, meal, userId, mealId);
      if (!day || !meal || !userId || !mealId) throw new Error("Missing Data");
      const isConfirmed = confirm("Do you want to Remove this meal?");
      if (!isConfirmed) return;
      toast.info("Meal Removing....");
      try {
        const response = await axiosInstanceS.post("/remove-meal", {
          userId,
          day,
          meal,
          mealId,
        });
        if (response.data.success) {
          await mealRefetch();
          toast.success("Meal Removed successfully!");
        } else {
          toast.error(response.data.msg);
        }
      } catch (error) {
        toast.error("Error Removing meal, try again.");
      } finally {
        closeModal();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Error, Try Again!"
      );
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [mealResults, setMealResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMeals = async () => {
    try {
      if (!searchQuery) return;
      setIsSearching(true);
      const response = await fetch(
        `https://api.spoonacular.com/food/menuItems/search?query=${searchQuery}&number=5&apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }`
      );
      const data = await response.json();
      setMealResults(data.menuItems || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Error fetching meals, try again.");
      setIsSearching(false);
    }
  };

  const closeModal = () => {
    setShowModal([false, "", "", ""]);
    setIsSearching(false);
    setMealResults([]);
    setSearchQuery("");
  };

  if (showModal[0])
    return (
      <Modal
        style={customStyles}
        isOpen={showModal[0]}
        onRequestClose={closeModal}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Search for a Meal</h2>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              className="border rounded-md px-2 py-1 w-full outline-none"
            />
            <button
              onClick={searchMeals}
              disabled={isSearching}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
            {isSearching || (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMealResults([]);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mealResults.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-2 p-2 border rounded-md cursor-pointer"
                onClick={async () => {
                  const isConfirmed = confirm("Do you want to add this meal?");
                  if (!isConfirmed) return;
                  toast.info("Meal Adding....");
                  try {
                    const response = await axiosInstanceS.post("/add-meal", {
                      userId: showModal[3],
                      day: showModal[1],
                      meal: showModal[2],
                      mealId: meal.id,
                    });
                    if (response.data.success) {
                      await mealRefetch();
                      toast.success("Meal added successfully!");
                    } else {
                      toast.error(response.data.msg);
                    }
                  } catch (error) {
                    toast.error("Error adding meal, try again.");
                  } finally {
                    closeModal();
                  }
                }}
              >
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-16 h-16 rounded-md"
                />
                <p>{meal.title}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  else if (!user || isLoading || userIsLoading)
    return (
      <div className="flex items-center justify-center">
        <CgSpinner className="text-2xl animate-spin font-black text-black" />
      </div>
    );
  else if (data === null)
    return (
      <div
        onClick={() => addMeal(day, meal, user?._id)}
        className="flex items-center justify-center cursor-pointer"
      >
        <CiCirclePlus className="text-4xl font-black text-black" />
      </div>
    );
  else
    return (
      <div className="relative flex flex-col items-center justify-center gap-1 group">
        <div
          onClick={() => deleteMeal(day, meal, user?._id, data.mealId)}
          className="absolute w-full h-[40%] top-0 left-0 cursor-pointer py-1 flex items-center justify-center bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <MdDelete className="font-semibold text-red-500" />
        </div>
        <img
          src={data.image}
          alt={data.name}
          className="w-[70px] h-[50px] rounded-md"
        />
        <p>{data.name}</p>
      </div>
    );
};

export default Meal;
