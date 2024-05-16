import { Routes, Route } from "react-router-dom";
import Login from "./view/auth/login";
import SignUp from "./view/auth/signUp";
import LandingPage from "./view/landingPage/landing";
import NotFound from "./view/error/notFound/notFound";
import MainPage from "./view/mainPage/mainPage";
import ResumeEdit from "./view/mainPage/resumeEdit/resumeEdit";
import ResumeList from "./view/mainPage/resumeList/resumeList";
import MyPage from "./view/mainPage/myPage/myPage";
import ResumeListDetails from "./view/mainPage/resumeList/details/details";
import AdminPage from "./view/admin/adminPage";
import ProtectedRoute from "./routes/protectedRoutes";

function App() {
  return (
    <div className="App" style={{ margin: "0" }}>
      <Routes>
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />}>
          <Route path="resume" element={<ResumeEdit />} />
          <Route path="resumelist/:id" element={<ResumeListDetails />} />
          <Route path="resumelist" element={<ResumeList />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
        <Route
          path="/admin/main"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
