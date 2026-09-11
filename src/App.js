
import './App.css';
import { Routes, Route } from "react-router-dom";
import Register from './Components/register';
import Home from './Components/Home';
import Login from './Components/Login';
import SkinScan from './Components/skinScan';
import About from './Components/about';
import HairScan from './Components/hairScan';
import Contact from './Components/Contact';
import History from './Components/History';
import ProtectedRoute from "./Components/ProtectedRoute";
import EmailVerificationHandler from "./Components/verify"
import AiInfo from './Components/AiInfo';
import PrivacyPolicy from './Components/privacy-policy';

function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<EmailVerificationHandler />} />

      <Route
        path="/about"
        element={
          <About />
        }
      />
      <Route path="/AiInfo" element={<AiInfo />} />

      <Route
        path="/about"
        element={
          <About />
        }
      />
      <Route
        path="/skinScan"
        element={
          <ProtectedRoute>
            <SkinScan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hairScan"
        element={
          <ProtectedRoute>
            <HairScan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

    </Routes>


  );
}

export default App;
