import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import Loader from "../../Components/Shared/Loader";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthProvider";
import Meal from "../../Components/Dashboard/Meal";

const MealManagement = () => {
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

  // Days of the week and meal types
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  return (
    <div className="w-[900px] my-20">
      <p className="font-semibold text-xl text-white bg-primary py-2 text-center w-full">
        Meal Management
      </p>
      <div className="overflow-x-auto mt-10">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Meal</th>
              {daysOfWeek.map((day, index) => (
                <th key={index} className="border px-4 py-3">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, mealIndex) => (
              <tr key={mealIndex}>
                <td className="border px-4 py-3 font-semibold">{meal}</td>
                {daysOfWeek.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="border hover:bg-gray-200 text-center"
                  >
                    <Meal day={day} meal={meal} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealManagement;
