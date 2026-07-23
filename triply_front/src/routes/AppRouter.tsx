import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
// import ApiTester from "../pages/ApiTester";
import Join from "../pages/Join";
import SplashStandard from "../pages/SplashStandard";
import SplashFun from "../pages/SplashFun";
import Main from "../pages/Main";
import MyPage from "../pages/MyPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashFun />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* <Route path="/api-test" element={<ApiTester />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
