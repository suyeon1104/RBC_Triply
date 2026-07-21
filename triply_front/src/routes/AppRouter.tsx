import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
// import ApiTester from "../pages/ApiTester";
import Join from "../pages/Join";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/api-test" element={<ApiTester />} /> */}
      </Routes>
    </BrowserRouter>
  );
}