import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Layout from "./components/layout/Layout";

import Gateway from "./pages/Skillgateaway";
import LandingPage from "./pages/Landing";
import Counselling from "./pages/Counselling";
import TechConsultation from "./pages/TechConsultation";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Reality from "./pages/Reality";
import Roadmap from "./pages/Roadmap";
import Learning from "./pages/Learning";
import Progress from "./pages/Progress";
import Consultation from "./pages/Consultation";
import Simulation from "./pages/Simulation";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const location = useLocation();

  return (
    <Layout>
      {/* keyed so the page transition in Layout gets a fresh subtree */}
      <Routes location={location} key={location.pathname}>
        {/* Entry gateway */}
        <Route path="/" element={<Gateway />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Career discovery */}
        <Route path="/counselling" element={<Counselling />} />
        <Route path="/tech-consultation" element={<TechConsultation />} />

        {/* Core journey */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/reality" element={<Reality />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/progress" element={<Progress />} />

        {/* Support screens */}
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/profile" element={<Profile />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Unknown routes fall back to the gateway */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
