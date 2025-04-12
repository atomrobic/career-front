import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import JobDetails from "./components/JobDetails";
 import AdminDashboard from "./components/Admin/AdminDashboard";
// import ApplyJob from "./pages/ApplyJob";
import Login from "./components/Login";
import Profile from "./components/Profile";
// import NotFound from "./pages/NotFound";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/details/:id" element={<JobDetails />} />
        <Route path="/"element={<Login/>}/>
      
        <Route path="/profile"element={<Profile/>}/>
        <Route path="/AdminDashboard"element={< AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
