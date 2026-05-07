import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Home from "./features/public/pages/Home";
import MedecinsList from "./features/public/pages/MedecinsList";
import MedecinDetails from "./features/public/pages/MedecinDetails";
import Specialites from "./features/public/pages/Specialites";
import Medicaments from "./features/public/pages/Medicaments";
function App() {
  const auth = useSelector((state) => state.auth);

  console.log("USER:", auth.user);
  console.log("TOKEN:", auth.token);
  console.log("ROLE:", auth.role);
  console.log("AUTH STATE:", auth);

  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/medecins" element={<MedecinsList />} />
      <Route path="/medecins/:id" element={<MedecinDetails />} />
      <Route path="/specialites" element={<Specialites />} />
      <Route path="/medicaments" element={<Medicaments />} />

    </Routes>);
}

export default App;