import LandingPage from "@/view/landingPage/landing";
import { Outlet, Route, Routes } from "react-router-dom";
import React from "react";
import SignUp from "@/view/auth/signUp";

const Auth = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default function AuthRoute() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />}>
        <Route index path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}
