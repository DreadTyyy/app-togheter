import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import { Route, Routes, useNavigate } from "react-router-dom";
import BlogDetailPage from "./pages/BlogDetailPage";
import QuestionPage from "./pages/QuestionPage";
import BlogsPage from "./pages/BlogsPage";
import ContestPage from "./pages/ContestPage";
import ContestDetailPage from "./pages/ContestDetailPage";
import AddBlogPage from "./pages/AddBlogPage";
import AddQuestionPage from "./pages/AddQuestionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getUserLogged, putAccessToken } from "./utils/network-data";

const App = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { username } = await getUserLogged();
      if (username !== null) {
        setAuthUser(username);
      }
    };
    fetchUser();
  }, []);

  const onLoginSuccess = (token) => {
    putAccessToken(token);
    const fetchUser = async () => {
      const { username } = await getUserLogged();
      if (username !== null) {
        setAuthUser(username);
      }
    };
    fetchUser();
    navigate("/");
  };
  const onLogoutHandler = () => {
    putAccessToken("");
    setAuthUser(null);
  };

  return (
    <div className="p-4">
      <Navbar
        isLogin={authUser !== null ? "Logout" : "Login"}
        onLogout={onLogoutHandler}
      />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage authUser={authUser} onLogin={onLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<RegisterPage authUser={authUser} />}
        />
        <Route path="/" element={<HomePage authUser={authUser} />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/contest" element={<ContestPage />} />
        <Route
          path="/question/:id"
          element={<QuestionDetailPage authUser={authUser} />}
        />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/contest/:id" element={<ContestDetailPage />} />
        <Route path="/blogs/add" element={<AddBlogPage />} />
        <Route path="/questions/add" element={<AddQuestionPage />} />
      </Routes>
    </div>
  );
};

export default App;
