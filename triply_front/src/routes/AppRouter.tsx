import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
// import ApiTester from "../pages/ApiTester";
import Join from "../pages/Join";
import SplashStandard from "../pages/SplashStandard";
import SplashFun from "../pages/SplashFun";
import Main from "../pages/Main";
import MyPage from "../pages/MyPage";
import Wallets from "../pages/Wallets";
import WalletHistory from "../pages/WalletHistory";
import WalletCreate from "../pages/WalletCreate";
import WalletAuth from "../pages/WalletAuth";
import WalletCharge from "../pages/WalletCharge";

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
        {/* 주희 작업 page */}
        <Route path="/wallet" element={<Wallets />} />
        <Route path="/wallet/history" element={<WalletHistory />} />
        <Route path="/wallet/create" element={<WalletCreate />} />
        <Route path="/wallet/auth" element={<WalletAuth />} />
        <Route path="/wallet/charge" element={<WalletCharge />} />
      </Routes>
    </BrowserRouter>
  );
}
