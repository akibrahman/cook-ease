import { useState } from "react";
import Timer from "../../Components/Dashboard/Timer";
import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const CookAlone = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mealResults, setMealResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isStepsShowing, setIsStepsShowing] = useState(["", []]);

  const axiosInstanceS = useAxiosSecure();

  const searchMeals = async () => {
    try {
      if (!searchQuery) return;
      setIsSearching(true);
      const { data } = await axiosInstanceS.post("/get-meal-from-chart", {
        searchQuery,
      });
      setMealResults(data.items || []);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Error fetching meals, try again.");
      setIsSearching(false);
    } finally {
      setIsSearched(true);
    }
  };

  const showStep = async (mealId, mealName) => {
    try {
      console.log(mealId);
      const { data } = await axios.get(
        `https://api.spoonacular.com/recipes/${mealId}/analyzedInstructions?apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }`
      );
      if (data.length == 0)
        return toast.info(
          "No Analyzed Instructions are Found for this Recipe!"
        );
      setIsStepsShowing([mealName, data[0].steps]);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Error fetching meals, try again.");
      setIsSearching(false);
    } finally {
      setIsSearched(true);
    }
  };

  return (
    <div className="w-[900px] my-20">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
        {isStepsShowing[0] == "" && (
          <p className="font-semibold text-xl text-white bg-primary py-2 text-center w-full">
            Cook Alone
          </p>
        )}
        <Timer />
      </div>
      {isStepsShowing[0] != "" ? (
        <div className="w-full mt-6">
          <p className="font-semibold text-xl text-white bg-primary py-2 text-center w-full relative">
            {isStepsShowing[0]}
            <FaTimes
              onClick={() => {
                setIsStepsShowing(["", []]);
              }}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-lg cursor-pointer"
            />
          </p>
          <div className="flex flex-col gap-3">
            {isStepsShowing[1].map((step) => (
              <div
                className="border-l-2 border-primary pl-3 mt-3 pb-2 space-y-2"
                key={step.number}
              >
                <p className="text-center font-bold">Step {step.number}</p>
                <p>
                  <span className="font-bold">Step:</span> {step.step}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-bold">Ingredients:</span>{" "}
                  {step.ingredients.length > 0
                    ? step.ingredients.map((ingredient, index) => (
                        <p key={index}>{ingredient.name}, </p>
                      ))
                    : "Not Mentioned"}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-bold">Equipment:</span>{" "}
                  {step.equipment.length > 0
                    ? step.equipment.map((equipmentt, index) => (
                        <p key={index}>{equipmentt.name}, </p>
                      ))
                    : "Not Mentioned"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Search Saved Meal</h2>
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
                  setIsSearched(false);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
          {isSearched && mealResults.length == 0 ? (
            <p className="font-semibold text-primary text-center">
              No Items Found
            </p>
          ) : isSearched && mealResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mealResults.map((meal) => (
                <div
                  key={meal.mealId}
                  onClick={() => showStep(meal.mealId, meal.title)}
                  className="flex items-center gap-2 p-2 border rounded-md cursor-pointer"
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
          ) : (
            <p className="font-semibold text-primary text-center">
              Try Searching Something
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CookAlone;
