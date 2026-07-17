import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ApiTester from "../pages/ApiTester";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/api-test" element={<ApiTester />} />
      </Routes>
    </BrowserRouter>
  );
}