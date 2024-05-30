import { Outlet } from "react-router-dom";
import CustomFooter from "../../components/footer";
import Navbar from "@/components/navbar/navbar";
import React from "react";

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <CustomFooter />
    </div>
  );
};

export default MainPage;
