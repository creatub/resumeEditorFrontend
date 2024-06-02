import LandingPage from "@/view/landingPage/landing";
import { Outlet, Route, Routes } from "react-router-dom";
import React from "react";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default function LayoutRoute() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path="/" element={<LandingPage />} />
      </Route>
    </Routes>
  );
}
