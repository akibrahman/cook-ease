import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const Timer = () => {
  const { user } = useContext(AuthContext);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [timer, setTimer] = useState(null); // Current timer in seconds
  const [intervalId, setIntervalId] = useState(null);

  const saveTimerToLocalStorage = (time) => {
    localStorage.setItem(
      `timer_${user.email}`,
      JSON.stringify({
        time,
        expiry: new Date().getTime() + time * 1000, // Save expiry time
      })
    );
  };

  const loadTimerFromLocalStorage = () => {
    const storedTimer = localStorage.getItem(`timer_${user.email}`);
    if (storedTimer) {
      const { expiry } = JSON.parse(storedTimer);
      const remainingTime = Math.max(0, (expiry - new Date().getTime()) / 1000);
      if (remainingTime > 0) return Math.floor(remainingTime);
    }
    return null;
  };

  const startTimer = () => {
    const totalSeconds = parseInt(minutes || 0) * 60 + parseInt(seconds || 0);
    if (isNaN(totalSeconds) || totalSeconds <= 0) return;

    setTimer(totalSeconds);
    saveTimerToLocalStorage(totalSeconds);

    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) {
          saveTimerToLocalStorage(prev - 1);
          return prev - 1;
        } else {
          clearInterval(id);
          setMinutes("");
          setSeconds("");
          setTimer(null);
          return 0;
        }
      });
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimer(null);
    localStorage.removeItem(`timer_${user.email}`);
  };

  useEffect(() => {
    const savedTimer = loadTimerFromLocalStorage();
    if (savedTimer) {
      setTimer(savedTimer);

      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) {
            saveTimerToLocalStorage(prev - 1);
            return prev - 1;
          } else {
            clearInterval(id);
            setTimer(null);
            return 0;
          }
        });
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, user.email]);

  return (
    <div className="flex flex-col items-center gap-4 mt-4 border border-primary w-max p-4 rounded">
      <p className="text-primary font-semibold">Timer</p>
      {timer === null ? (
        <>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="border p-2 rounded outline-none"
            />
            <input
              type="number"
              placeholder="Seconds"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              className="border p-2 rounded outline-none"
            />
          </div>
          <button
            onClick={startTimer}
            className="bg-primary font-semibold text-white py-2 px-6 rounded"
          >
            Start
          </button>
        </>
      ) : (
        <div className="text-xl font-bold w-max">
          Time Remaining: {Math.floor(timer / 60)}:{timer % 60}
        </div>
      )}
      {timer !== null && (
        <button
          onClick={stopTimer}
          className="bg-red-500 font-semibold text-white py-2 px-6 rounded mt-2"
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default Timer;
