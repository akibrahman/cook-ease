import { Outlet } from "react-router-dom";
import NavBar from "./Components/Shared/NavBar";

function App() {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
