import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import CreateQuiz from "./pages/CreateQuiz";
import ManageQuizzes from "./pages/ManageQuizzes";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { token } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth" element={token ? <Navigate to="/" replace /> : <Auth />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/quiz/:category" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/result" element={<PrivateRoute><Result /></PrivateRoute>} />
        <Route path="/create-quiz" element={<AdminRoute><CreateQuiz /></AdminRoute>} />
        <Route path="/manage-quizzes" element={<AdminRoute><ManageQuizzes /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
