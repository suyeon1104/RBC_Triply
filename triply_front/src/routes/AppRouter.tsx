import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Join from "../pages/Join";
import Login from "../pages/Login";
// import ApiTester from "../pages/ApiTester";
// import SplashStandard from '../pages/SplashStandard';
import SplashFun from "../pages/SplashFun";
import Main from "../pages/Main";
import MyPage from "../pages/MyPage";
import MyPageEditProfile from "../pages/MyPageEditProfile";
import Wallets from "../pages/Wallets";
import WalletHistory from "../pages/WalletHistory";
import WalletCreate from "../pages/WalletCreate";
import WalletAuth from "../pages/WalletAuth";
import WalletCharge from "../pages/WalletCharge";
import PaymentPay from "../pages/PaymentPay";
import Group from "../pages/Group";
import MakeGroup from "../pages/MakeGroup";
import SettlementCreate from "../pages/SettlementCreate";
import GroupDetail from "../pages/GroupDetail";
import Planner from "../pages/Planner";
import CreateTrip from "../pages/CreateTrip";
import Notification from "../pages/Notification";
import { useAuth } from "../contexts/useAuth";
import PlanDetailCreate from "../pages/PlanDetailCreate";
import GroupTripList from "../pages/GroupTripList";
import { TripDetail } from "../pages/TripDetail";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/main" replace /> : <SplashFun />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/main" replace /> : <Login />
          }
        />

        <Route
          path="/join"
          element={isAuthenticated ? <Navigate to="/main" replace /> : <Join />}
        />

        <Route
          element={
            isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/main" element={<Main />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/editprofile" element={<MyPageEditProfile />} />
          {/* <Route path="/api-test" element={<ApiTester />} /> */}
          {/* 주희 작업 page */}
          <Route path="/wallet" element={<Wallets />} />
          <Route path="/wallet/history" element={<WalletHistory />} />
          <Route path="/wallet/create" element={<WalletCreate />} />
          <Route path="/wallet/auth" element={<WalletAuth />} />
          <Route path="/wallet/charge" element={<WalletCharge />} />
          <Route path="/payment/pay" element={<PaymentPay />} />
          <Route
            path="/settlement/create/:paymentId"
            element={<SettlementCreate />}
          />
          <Route path="/trip/detail/:tripId" element={<TripDetail />} />
          <Route path="/notification" element={<Notification />} />
          <Route
            path="/trip/:tripId/schedule/new"
            element={<PlanDetailCreate />}
          />

          <Route
            path="/trip/schedule/:scheduleId"
            element={<PlanDetailCreate />}
          />

          <Route
            path="/trip/schedule/:scheduleId/edit"
            element={<PlanDetailCreate />}
          />
          <Route path="/group/:groupId/trips" element={<GroupTripList />} />
          {/* 수연 */}
          <Route path="/planner" element={<Planner />} />
          <Route path="/trip/createTrip" element={<CreateTrip />} />
          {/* 재현 */}
          <Route path="/group" element={<Group />} />
          <Route path="/group/makegroup" element={<MakeGroup />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
