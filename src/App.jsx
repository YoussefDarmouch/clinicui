import { useSelector } from "react-redux";
import Login from "./features/auth/pages/Login";
import MainLayout from "./components/layout/MainLayou";
import Register from "./features/auth/pages/Register";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const auth = useSelector((state) => state.auth);

  console.log("USER:", auth.user);
  console.log("TOKEN:", auth.token);
  console.log("ROLE:", auth.role);
  console.log("AUTH STATE:", auth);

  return <AppRoutes />;
}

export default App;