import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
// import ApiTester from "../pages/ApiTester";
import Join from '../pages/Join';
import SplashStandard from '../pages/SplashStandard';
import SplashFun from '../pages/SplashFun';
import Main from '../pages/Main';
import MyPage from '../pages/MyPage';
import Wallets from '../pages/Wallets';
import WalletHistory from '../pages/WalletHistory';
import Group from '../pages/Group';
import ButtonTest from '../pages/ButtonTest';

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
        {/* 재현 */}
        <Route path="/group" element={<Group />} />
        {/* 테스트 */}
        <Route path="/button" element={<ButtonTest />} />
      </Routes>
    </BrowserRouter>
  );
}
